/* eslint-disable no-param-reassign */
import test from "ava"

const { beforeHookMongo, afterHookMongo } = require("../_utils")
const Tag = require("../../models/tag")

test.before(beforeHookMongo)
test.after.always(afterHookMongo)


test.beforeEach(async (t) => {
  // fixture data set:
  const tag = await Tag.create({ text: "Tag1", type: "skill" })
  t.context.tagId = String(tag._id)
})
test.afterEach(async (t) => {
  await Tag.remove({})
})

test.serial("my passing test 1", async (t) => {
  const tags = await Tag.batchUpsert("skill", ["Tag1", "Tag2"])
  t.is(tags.length, 2)
  t.true(tags.map(String).includes(t.context.tagId))
  t.is(await Tag.count({ text: "Tag1", type: "skill" }).exec(), 1)
  t.is(await Tag.count({ text: "Tag2", type: "skill" }).exec(), 1)
})
