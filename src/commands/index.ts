import ping from "./ping";
import { APIApplicationCommandOptionBase, APIUserApplicationCommandGuildInteraction, ApplicationCommandOptionType } from "discord-api-types/v10"

//@ts-ignore // I just cant find where is the type for command ;-;
export interface data extends APIApplicationCommandOptionBase<ApplicationCommandOptionType>{
    type?: ApplicationCommandOptionType
}

export interface Command {
    data: data,
    execute: (interaction: APIUserApplicationCommandGuildInteraction) => void
}

export default [
    ping
]