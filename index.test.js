const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('splits gradient stops into two gradients', async () => {
  await run(

`.test {
background:
linear-gradient(to right, #5bdcdc calc((100% / 12) - 4px), transparent calc((100% / 12) - 4px), transparent calc((100% / 12) + 4px), #53cfd5 calc((100% / 12) + 4px), #53cfd5 calc(((100% / 12) * 2) + 1% - 4px), transparent calc(((100% / 12) * 2) + 1% - 4px), transparent calc(((100% / 12) * 2) + 1% + 4px), #86d6d9 calc(((100% / 12) * 2) - 1% + 4px), #86d6d9 calc(((100% / 12) * 3) + 1% - 4px), transparent calc(((100% / 12) * 3) + 1% - 4px), transparent calc(((100% / 12) * 3) + 1% + 4px), #75acac calc(((100% / 12) * 3) - 1% + 4px), #75acac calc(((100% / 12) * 4) + 1% - 4px), transparent calc(((100% / 12) * 4) + 1% - 4px), transparent calc(((100% / 12) * 4) + 1% + 4px), #6699a8 calc(((100% / 12) * 4) - 1% + 4px), #6699a8 calc(((100% / 12) * 5) + 1% - 4px), transparent calc(((100% / 12) * 5) + 1% - 4px), transparent calc(((100% / 12) * 5) + 1% + 4px), #a09daf calc(((100% / 12) * 5) - 1% + 4px), #a09daf calc(((100% / 12) * 6) + 1% - 4px), transparent calc(((100% / 12) * 6) + 1% - 4px), transparent calc(((100% / 12) * 6) + 1% + 4px), #a386a4 calc(((100% / 12) * 6) - 1% + 4px), #a386a4 calc(((100% / 12) * 7) + 1% - 4px), transparent calc(((100% / 12) * 7) + 1% - 4px), transparent calc(((100% / 12) * 7) + 1% + 4px), #dac7cb calc(((100% / 12) * 7) - 1% + 4px), #dac7cb calc(((100% / 12) * 8) + 1% - 4px), transparent calc(((100% / 12) * 8) + 1% - 4px), transparent calc(((100% / 12) * 8) + 1% + 4px), #e2cac6 calc(((100% / 12) * 8) - 1% + 4px), #e2cac6 calc(((100% / 12) * 9) + 1% - 4px), transparent calc(((100% / 12) * 9) + 1% - 4px), transparent calc(((100% / 12) * 9) + 1% + 4px), #eed0c8 calc(((100% / 12) * 9) - 1% + 4px), #eed0c8 calc(((100% / 12) * 10) + 1% - 4px), transparent calc(((100% / 12) * 10) + 1% - 4px), transparent calc(((100% / 12) * 10) + 1% + 4px), #f2b1b1 calc(((100% / 12) * 10) - 1% + 4px), #f2b1b1 calc(((100% / 12) * 11) + 1% - 4px), transparent calc(((100% / 12) * 11) + 1% - 4px), transparent calc(((100% / 12) * 11) + 1% + 4px), #fbeeea calc(((100% / 12) * 11) - 1% + 4px), #fbeeea calc(((100% / 12) * 12) + 1% - 4px));
}`

,

`.test {
background:

}`

,

{}

)
})
