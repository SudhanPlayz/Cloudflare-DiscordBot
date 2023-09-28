import ping from "./ping";
import { ApplicationCommand, Interaction } from "../types";

export interface Command {
    data: ApplicationCommand,
    execute: (interaction: Interaction) => void
}

export default [
    ping
]