const valuesParse = require('postcss-values-parser'),
      parseValues = valuesParse.parse,
	  Punctuation = require('postcss-values-parser/lib/nodes/Punctuation'),
	  Word        = require('postcss-values-parser/lib/nodes/Word');
const splitArray  = require('split-array');

module.exports = (opts = { }) => {

	const DEFAULTS = {
		stopsLimit: 7 * 2,
	};
	let config = Object.assign(opts, DEFAULTS);

	let stopsLimit = config.stopsLimit;


	return {
		postcssPlugin: 'postcss-blurry-gradient-workaround',

		Declaration (decl, postcss) {
			if(decl.bgwProcessed) return;

			let values = parseValues(decl.value);
			let gradientsAst = getGradientFuncs(values);

			for(let gradientAst of gradientsAst) {
				let gradientDetails = getGradientDetails(gradientAst);
				if(gradientDetails.colorStops.length <= stopsLimit) continue;

				const commaPunctuation = new Punctuation({ value: ',' });
				const transparentColor = new Word({
					value: 'transparent',
				});


				const stopsSubsets = splitArray(gradientDetails.colorStops, (stopsLimit - 1));


				// placeholder as last color stop (except for last gradient)
				for(let stopsSubsetIndex in stopsSubsets) {
					let prevSubset = stopsSubsets[ stopsSubsetIndex - 1 ];
					if(prevSubset) {
						let lastPrevStop    = prevSubset[ prevSubset.length - 1 ];
						let placeholderStop = {
							value: [
								transparentColor.clone(), // transparent color
							],
							pos:   [],
						};

						// clone position of stop
						for(let lsp of lastPrevStop.pos) {
							placeholderStop.pos.push(lsp.clone());
						}


						placeholderStop.nodes = [ commaPunctuation.clone() ]
													.concat( placeholderStop.value)
													.concat( placeholderStop.pos);

						stopsSubsets[stopsSubsetIndex - 1].push(placeholderStop); // (prevSubset)
					}
				}

				

				// AST
				for(let stopsSubsetIndex in stopsSubsets) {
					const isLastSubset = stopsSubsetIndex >= (stopsSubsets.length - 1)

					// separate gradient
					let extraGradientAst = gradientAst.cloneBefore();

					// separator between gradients
					if(!isLastSubset)
						gradientDetails.fnNode.parent.insertAfter(extraGradientAst, commaPunctuation.clone());


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
				decl.value        = values; // .toString()
				decl.bgwProcessed = true;
			}
		}
	}
}
module.exports.postcss = true


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
	if(curStop)
		gradient.colorStops.push(curStop);

	return gradient;
}
