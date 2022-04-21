/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GuildInfo
// ====================================================

export interface GuildInfo_guild_channels_TextChannel_category {
  __typename: "Category";
  name: string;
  position: number;
}

export interface GuildInfo_guild_channels_TextChannel {
  __typename: "TextChannel";
  name: string;
  id: string;
  position: number;
  category: GuildInfo_guild_channels_TextChannel_category | null;
  topic: string | null;
  canSend: boolean;
  nsfw: boolean;
}

export interface GuildInfo_guild_channels_AnnouncementChannel_category {
  __typename: "Category";
  name: string;
  position: number;
}

export interface GuildInfo_guild_channels_AnnouncementChannel {
  __typename: "AnnouncementChannel";
  name: string;
  id: string;
  position: number;
  category: GuildInfo_guild_channels_AnnouncementChannel_category | null;
  topic: string | null;
  canSend: boolean;
  nsfw: boolean;
}

export type GuildInfo_guild_channels = GuildInfo_guild_channels_TextChannel | GuildInfo_guild_channels_AnnouncementChannel;

export interface GuildInfo_guild_roles {
  __typename: "Role";
  id: string;
  name: string;
  color: number;
}

export interface GuildInfo_guild_emojis {
  __typename: "Emoji";
  id: string;
  name: string;
  animated: boolean;
  available: boolean;
}

export interface GuildInfo_guild {
  __typename: "Guild";
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  rulesChannelId: string | null;
  banner: string | null;
  splash: string | null;
  partnered: string;
  verified: string;
  tier: string;
  channels: GuildInfo_guild_channels[];
  roles: GuildInfo_guild_roles[];
  emojis: GuildInfo_guild_emojis[];
}

export interface GuildInfo {
  guild: GuildInfo_guild;
}

export interface GuildInfoVariables {
  guild: string;
}
