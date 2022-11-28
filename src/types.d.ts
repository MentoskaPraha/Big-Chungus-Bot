//dependancies
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

//userDB interfaces
export interface userDBEntry{
    id:string
    title:string
    color:string
    colorRoleId:string
}

export interface userDBFuncs{
    syncDB():Promise<void>
    create(id: string):Promise<boolean>
    edit(id: string, newTitle: string | null, newColor: string | null, newColorRoleId: string | null):Promise<boolean>
    read(id: string):Promise<userDBEntry | boolean>
    delete(id: string):Promise<boolean>
    getTitle(id: string):Promise<string>
}

//command interfaces
export interface commandObject{
    name:string
    data:SlashCommandBuilder
    ephemeral:boolean
    execute(interaction:CommandInteraction):Promise<void>
}

//function interfaces
export interface funcObject{
    name:string
    execute(...args:any):Promise<void>
}

//event handler interfaces
export interface eventObject{
    name: string,
    once: boolean,
    execute(...args:any): Promise<void>
}
