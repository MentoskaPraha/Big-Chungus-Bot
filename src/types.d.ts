//dependancies
import { CommandInteraction } from "discord.js";

//userDB interfaces
export interface userDBEntry{
    id:string
    title:string
    color:string
    colorRoleId:string
}

export interface userDBFuncs{
    syncDB():Promise<void>
    create(id: string):Promise<number>
    edit(id: string, newTitle: string | null, newColor: string | null, newColorRoleId: string | null):Promise<number>
    read(id: string):Promise<userDBEntry | number>
    delete(id: string):Promise<number>
    getTitle(id: string):Promise<string>
}

//command interfaces
export interface commandObject{
    name:string
    data:any
    ephemeral:boolean
    execute(interaction:CommandInteraction):Promise<void>
}

//function interfaces
export interface funcObject{
    name:string
    execute(...args:any):Promise<void>
}

//event interfaces
export interface eventObject{
    name: string,
    once: boolean,
    execute(...args:any): Promise<void>
}
