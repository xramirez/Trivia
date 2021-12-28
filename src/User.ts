export interface User {
    id:string //This will be the username, and also the id by which it will recognize the user. That way if a user is deleted from the database,
    //then the username is "open" again for use
    password:string //required for login!
    name:string //This can be either a repeat of the username, or the actual name if the user so desires. 
    score: { //The following stats are from the old statblock, and honestly they can stay. I like them.
        perfectWin:number
        easyWin:number; //I'm thinking that I can have the game default to easy if the user picks no difficulty.
        easyLoss:number; //So these numbers will probably be a little up there
        medWin:number;
        medLoss:number;
        hardWin:number;
        hardLoss:number;
    } //I'm thinking that I can have the game default to easy if the user picks no difficulty.
    genres: {
        filmWins:number;
        musicWins:number;
        tvWins:number;
        gamingWins:number;
    }
    //bestTime:Date //Not sure about this one yet, but it could be a good chance to use the date pipe?
}