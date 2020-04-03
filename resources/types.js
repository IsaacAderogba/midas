const { enumType } = require("nexus");

const MutationEnum = {
  CREATED: "CREATED",
  UPDATED: "UPDATED",
  DELETED: "DELETED",
};

const MutationType = enumType({
  name: "MutationType",
  members: [
    MutationEnum.CREATED,
    MutationEnum.UPDATED,
    MutationEnum.DELETED,
  ],
});

module.exports = {
  MutationType,
  MutationEnum,
};
