// Borrowed from: https://github.com/glenstack/glenstack/blob/master/packages/cf-workers-discord-bot/src/types.ts

export enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
  }

  export type ApplicationCommandOptionChoice = {
    name: string;
    value: string | number;
  };

  export type ApplicationCommandOption = {
    type: ApplicationCommandOptionType;
    name: string;
    description: string;
    default?: boolean;
    required?: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: ApplicationCommandOption[];
  };

  export type ApplicationCommand = {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
  };

  export type Snowflake = string;

  export enum InteractionType {
    Ping = 1,
    ApplicationCommand = 2,
  }

  export type OptionType = any;

  export type ApplicationCommandInteractionDataOption = {
    name: string;
    value?: OptionType;
    options?: ApplicationCommandInteractionDataOption[];
  };

  export type ApplicationCommandInteractionData = {
    id: Snowflake;
    name: string;
    options?: ApplicationCommandInteractionDataOption[];
  };

  export type GuildMember = {
    deaf: boolean;
    is_pending: boolean;
    joined_at: string;
    mute: boolean;
    nick?: string;
    pending: boolean;
    permissions: string;
    premium_since?: string;
    roles: string[];
    user: {
      avatar?: string;
      discriminator: string;
      id: string;
      public_flags: number;
      username: string;
    };
  };

  export type Interaction = {
    id: Snowflake;
    type: InteractionType;
    data?: ApplicationCommandInteractionData;
    guild_id: Snowflake;
    channel_id: Snowflake;
    member: GuildMember;
    token: string;
    version: number;
  };