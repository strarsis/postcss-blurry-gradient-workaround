
function parseGradients(funcNode) {
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
        if((node.type === 'word' || 
           (node.type === 'numeric' && node.unit === 'deg'))
           && !inStopsPart) {
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

module.exports = parseGradients;
