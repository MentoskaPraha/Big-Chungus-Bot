//declare userDB types
interface userDBEntry{
    id:string
    title:string
    color:string
    colorRoleId:string
}

interface userDBFuncs{
    syncDB():Promise<void>
    create(id: string):Promise<number>
    edit(id: string, newTitle: string | null, newColor: string | null, newColorRoleId: string | null):Promise<number>
    read(id: string):Promise<userDBEntry | number>
    delete(id: string):Promise<number>
    getTitle(id: string):Promise<string>
}
