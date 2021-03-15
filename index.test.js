const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('splits gradient stops into two gradients', async () => {
  await run(

`.foo {
    /* Input example */
	background:
		linear-gradient(to right,
		  green        10%,
		  yellowgreen  10%, yellowgreen  20%,
		  yellow       20%, yellow       30%,
		  orange       30%, orange       40%,
		  red          40%, red          50%,
		  grey         50%, grey         60%,
		  blue         60%, rgba(255,0,0,0) 70%,
		  green        70%, green        70%,
		  yellowgreen  70%, yellowgreen  80%,
		  yellow       80%, yellow       90%,
		  salmon       90%);
}`
,

`.foo {
    /* Input example */
	background:
		linear-gradient(to right,
		  green        10%,
		  yellowgreen  10%, yellowgreen  20%,
		  yellow       20%, yellow       30%,
		  orange       30%, orange       40%,
		  red          40%, red          50%,
		  grey         50%, grey         60%,
		  blue         60%, rgba(255,0,0,0) 70%) , linear-gradient(to right , transparent 70%,
		  green        70%, green        70%,
		  yellowgreen  70%, yellowgreen  80%,
		  yellow       80%, yellow       90%,
		  salmon       90%);
}`
,

{}

)
})

it('splits a large number of a more complex gradient stops into multiple gradients', async () => {
  await run(

`.foo {
  /* Input example */
  background: linear-gradient(to right,
    #5bdcdc calc((100% / 12) - 4px),
    transparent calc((100% / 12) - 4px),
    transparent calc((100% / 12) + 4px),
    #53cfd5 calc((100% / 12) + 4px),
    #53cfd5 calc(((100% / 12) * 2) + 1% - 4px),
    transparent calc(((100% / 12) * 2) + 1% - 4px),
    transparent calc(((100% / 12) * 2) + 1% + 4px),
    #86d6d9 calc(((100% / 12) * 2) - 1% + 4px),
    #86d6d9 calc(((100% / 12) * 3) + 1% - 4px),
    transparent calc(((100% / 12) * 3) + 1% - 4px),
    transparent calc(((100% / 12) * 3) + 1% + 4px),
    #75acac calc(((100% / 12) * 3) - 1% + 4px),
    #75acac calc(((100% / 12) * 4) + 1% - 4px),
    transparent calc(((100% / 12) * 4) + 1% - 4px),
    transparent calc(((100% / 12) * 4) + 1% + 4px),
    #6699a8 calc(((100% / 12) * 4) - 1% + 4px),
    #6699a8 calc(((100% / 12) * 5) + 1% - 4px),
    transparent calc(((100% / 12) * 5) + 1% - 4px),
    transparent calc(((100% / 12) * 5) + 1% + 4px),
    #a09daf calc(((100% / 12) * 5) - 1% + 4px),
    #a09daf calc(((100% / 12) * 6) + 1% - 4px),
    transparent calc(((100% / 12) * 6) + 1% - 4px),
    transparent calc(((100% / 12) * 6) + 1% + 4px),
    #a386a4 calc(((100% / 12) * 6) - 1% + 4px),
    #a386a4 calc(((100% / 12) * 7) + 1% - 4px),
    transparent calc(((100% / 12) * 7) + 1% - 4px),
    transparent calc(((100% / 12) * 7) + 1% + 4px),
    #dac7cb calc(((100% / 12) * 7) - 1% + 4px),
    #dac7cb calc(((100% / 12) * 8) + 1% - 4px),
    transparent calc(((100% / 12) * 8) + 1% - 4px),
    transparent calc(((100% / 12) * 8) + 1% + 4px),
    #e2cac6 calc(((100% / 12) * 8) - 1% + 4px),
    #e2cac6 calc(((100% / 12) * 9) + 1% - 4px),
    transparent calc(((100% / 12) * 9) + 1% - 4px),
    transparent calc(((100% / 12) * 9) + 1% + 4px),
    #eed0c8 calc(((100% / 12) * 9) - 1% + 4px),
    #eed0c8 calc(((100% / 12) * 10) + 1% - 4px),
    transparent calc(((100% / 12) * 10) + 1% - 4px),
    transparent calc(((100% / 12) * 10) + 1% + 4px),
    #f2b1b1 calc(((100% / 12) * 10) - 1% + 4px),
    #f2b1b1 calc(((100% / 12) * 11) + 1% - 4px),
    transparent calc(((100% / 12) * 11) + 1% - 4px),
    transparent calc(((100% / 12) * 11) + 1% + 4px),
    #fbeeea calc(((100% / 12) * 11) - 1% + 4px),
    #fbeeea calc(((100% / 12) * 12) + 1% - 4px)
);

}`
,

`.foo {
  /* Input example */
  background: linear-gradient(to right,
    #5bdcdc calc((100% / 12) - 4px),
    transparent calc((100% / 12) - 4px),
    transparent calc((100% / 12) + 4px),
    #53cfd5 calc((100% / 12) + 4px),
    #53cfd5 calc(((100% / 12) * 2) + 1% - 4px),
    transparent calc(((100% / 12) * 2) + 1% - 4px),
    transparent calc(((100% / 12) * 2) + 1% + 4px),
    #86d6d9 calc(((100% / 12) * 2) - 1% + 4px),
    #86d6d9 calc(((100% / 12) * 3) + 1% - 4px),
    transparent calc(((100% / 12) * 3) + 1% - 4px),
    transparent calc(((100% / 12) * 3) + 1% + 4px),
    #75acac calc(((100% / 12) * 3) - 1% + 4px),
    #75acac calc(((100% / 12) * 4) + 1% - 4px) , transparent calc(((100% / 12) * 4) + 1% - 4px)) , linear-gradient(to right,
    transparent calc(((100% / 12) * 4) + 1% - 4px),
    transparent calc(((100% / 12) * 4) + 1% + 4px),
    #6699a8 calc(((100% / 12) * 4) - 1% + 4px),
    #6699a8 calc(((100% / 12) * 5) + 1% - 4px),
    transparent calc(((100% / 12) * 5) + 1% - 4px),
    transparent calc(((100% / 12) * 5) + 1% + 4px),
    #a09daf calc(((100% / 12) * 5) - 1% + 4px),
    #a09daf calc(((100% / 12) * 6) + 1% - 4px),
    transparent calc(((100% / 12) * 6) + 1% - 4px),
    transparent calc(((100% / 12) * 6) + 1% + 4px),
    #a386a4 calc(((100% / 12) * 6) - 1% + 4px),
    #a386a4 calc(((100% / 12) * 7) + 1% - 4px),
    transparent calc(((100% / 12) * 7) + 1% - 4px)) , linear-gradient(to right,
    transparent calc(((100% / 12) * 7) + 1% + 4px),
    #dac7cb calc(((100% / 12) * 7) - 1% + 4px),
    #dac7cb calc(((100% / 12) * 8) + 1% - 4px),
    transparent calc(((100% / 12) * 8) + 1% - 4px),
    transparent calc(((100% / 12) * 8) + 1% + 4px),
    #e2cac6 calc(((100% / 12) * 8) - 1% + 4px),
    #e2cac6 calc(((100% / 12) * 9) + 1% - 4px),
    transparent calc(((100% / 12) * 9) + 1% - 4px),
    transparent calc(((100% / 12) * 9) + 1% + 4px),
    #eed0c8 calc(((100% / 12) * 9) - 1% + 4px),
    #eed0c8 calc(((100% / 12) * 10) + 1% - 4px),
    transparent calc(((100% / 12) * 10) + 1% - 4px),
    transparent calc(((100% / 12) * 10) + 1% + 4px)) , linear-gradient(to right , transparent calc(((100% / 12) * 10) + 1% + 4px),
    #f2b1b1 calc(((100% / 12) * 10) - 1% + 4px),
    #f2b1b1 calc(((100% / 12) * 11) + 1% - 4px),
    transparent calc(((100% / 12) * 11) + 1% - 4px),
    transparent calc(((100% / 12) * 11) + 1% + 4px),
    #fbeeea calc(((100% / 12) * 11) - 1% + 4px),
    #fbeeea calc(((100% / 12) * 12) + 1% - 4px)
);

}`,

{}

)
})
