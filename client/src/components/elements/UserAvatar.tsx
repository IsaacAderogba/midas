// modules
import React from "react";

// components
import { Avatar } from "antd";

// helpers
import { User } from "../../generated/graphql";
import { Maybe } from "../../~reusables/utils/types";

interface IUserAvatar {
  user?: Maybe<Pick<User, "avatarURL" | "firstName">>;
  style?: React.CSSProperties | undefined
}

export const UserAvatar: React.FC<IUserAvatar> = ({ user, style }) => {
  if (user) {
    return user.avatarURL ? (
      <Avatar style={style} src={user.avatarURL} />
    ) : (
      <Avatar style={style}>
        {user && user.firstName ? user.firstName[0].toUpperCase() : ""}
      </Avatar>
    );
  }
  return null;
};
