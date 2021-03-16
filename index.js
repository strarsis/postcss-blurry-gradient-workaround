const valuesParse = require('postcss-values-parser'),
      parseValues = valuesParse.parse,
      Punctuation = require('postcss-values-parser/lib/nodes/Punctuation'),
      Word        = require('postcss-values-parser/lib/nodes/Word'),
      parseColor  = require('color-parse'),
      splitArray  = require('split-array');

module.exports = (opts = {}) => {

    const DEFAULTS = {
        stopsLimit: 8 * 2,
    };
    let config = Object.assign(opts, DEFAULTS);


    return {
        postcssPlugin: 'postcss-blurry-gradient-workaround',

        Declaration (decl) {

            if(!decl.raws || !decl.raws.between || 
              !decl.raws.between.match('apply-gradient-stops-workaround')) return;
              // TODO: Use comment node when PostCSS supports them in values / use more specifically matching regexp.
              //       @see https://github.com/postcss/postcss/issues/1145#issuecomment-799786858

            return processDecl( decl, config );
        },

    }
}
module.exports.postcss = true




function processDecl( decl, config ) {
    let stopsLimit = config.stopsLimit - 2;
                        // 2 empty slots are needed for eventual placeholders

    if(decl.bgwProcessed) return;

    let values       = parseValues(decl.value);
    let gradientsAst = getGradientFuncs(values);

    for(let gradientAst of gradientsAst) {
        let gradientDetails = getGradientDetails(gradientAst);
        if(gradientDetails.colorStops.length <= stopsLimit) continue;
            // stops within limit, no further action needed

        const stopsSubsets = splitArray(gradientDetails.colorStops, (stopsLimit - 1));
            // split stops into subsets within limit

        // placeholder as first/last color stop (except for last gradient)
        for(let stopsSubsetIndex in stopsSubsets) {
            let curSubset  = stopsSubsets[ stopsSubsetIndex     ];
            let prevSubset = stopsSubsets[ stopsSubsetIndex - 1 ]; // (last)
            if(!prevSubset) continue; // not for the first subset


            // placeholder at end   of previous gradient
            let lastPrevStop      = prevSubset[ prevSubset.length - 1 ], // (last)
                lastPrevStopColor = lastPrevStop.value;
            if(!isColorTransparent( lastPrevStopColor )) {
                    // stops with already transparent colors don't need a placeholder
                let endPlaceholderStop   = createPlaceholderStop(lastPrevStop);
                stopsSubsets[ stopsSubsetIndex - 1 ].push(endPlaceholderStop);   // (prevSubset)
            }


            // placeholder at start of current  gradient
            let lastCurStop      = curSubset[ curSubset.length - 1 ], // (last)
                lastCurStopColor = lastCurStop.value;
            if(!isColorTransparent( lastCurStopColor )) {
                // stops with already transparent colors don't need a placeholder

                let startPlaceholderStop = createPlaceholderStop(lastPrevStop);
                stopsSubsets[ stopsSubsetIndex ].unshift(startPlaceholderStop); // (curSubset)
            }

        }




        // AST
        for(let stopsSubsetIndex in stopsSubsets) {
            const isLastSubset = stopsSubsetIndex >= (stopsSubsets.length - 1)

            // separate gradient
            let extraGradientAst = gradientAst.cloneBefore();

            // separator between gradients
            if(!isLastSubset) {
                const commaPunctuation = new Punctuation({ value: ',' });
                gradientDetails.fnNode.parent.insertAfter(extraGradientAst, commaPunctuation);
            }


            // repopulate gradient with subset
            extraGradientAst.removeAll();

            // direction
            if(gradientDetails.direction) {
                for(let gradientDirection of gradientDetails.direction) {
                    extraGradientAst.append(gradientDirection.clone());
                }
            }

            // color stops
            let stopsSubset = stopsSubsets[stopsSubsetIndex];
            for(let stop of stopsSubset) {
                if(stop.nodes) {
                    for(let stopNode of stop.nodes) {
                        extraGradientAst.append(stopNode.clone());
                    }
                }
            }

        }


        // clean up original gradient (after cloning it)
        gradientAst.remove();


        // Update value
        let newValue      = values.toString();

        decl.value        = newValue;
        decl.bgwProcessed = true;

    }
}

function createPlaceholderStop(sourceStop) {
    // create ASTs
    const commaPunctuation = new Punctuation({ value: ',' });
    const transparentColor = new Word({
        value: 'transparent',
    });


    // create gradient stop model
    let placeholderStop = {
        value: [
            transparentColor.clone(), // transparent color
        ],
        pos:   [],
    };

    // clone position of stop
    for(let stopPos of sourceStop.pos) {
        placeholderStop.pos.push(stopPos.clone());
    }


    // set nodes of stop for raw append
    placeholderStop.nodes = [ commaPunctuation ]
                                .concat( placeholderStop.value)
                                .concat( placeholderStop.pos);


    return placeholderStop;
}

function isColorTransparent(colorNode) {
    if(!colorNode) return false;
    const colorStr    = colorNode.toString();
    const colorParsed = parseColor(colorStr);
    return colorParsed.alpha === 0;
}

function getGradientFuncs(values) {
    let gradients = [];
    values.walkFuncs((funcNode) => {
        if(!funcNode.name.includes('-gradient')) return;

        gradients.push(funcNode);
    });
    return gradients;
}


function getGradientDetails(funcNode) {
    let gradient = {
        direction:  [],
        colorStops: [],
        fnNode:     null,
    };

    gradient.fnNode = funcNode;

    let inDirectionPart = false;
    let inStopsPart     = false;
    var curStop         = false;
    funcNode.each((node) => {
        if(node.type === 'word' && !inStopsPart) {
            inDirectionPart = true;
        }
        if(!inStopsPart && node.type === 'punctuation') {
            inDirectionPart = false;
            inStopsPart     = true;
        }
        if(inDirectionPart) { // direction
            gradient.direction.push(node);
        }

        if(inStopsPart) { // stops
            if(node.type === 'punctuation' && node.value === ',') { // stop
                if(curStop)
                    gradient.colorStops.push(curStop);

                curStop = {
                    value: [],
                    pos:   [],
                    nodes: [],
                };
            } else {
                if( node.isColor ||
                   (node.type === 'word' && node.value === 'transparent')) { // (transparent not treated as color)
                    // color
                    curStop.value.push(node);
                } else {
                    // position
                    curStop.pos.push(node);
                }
            }

            curStop.nodes.push(node); // collects all nodes for later use
        }
    });

    // for the last stop
    gradient.colorStops.push(curStop);

    return gradient;
}
