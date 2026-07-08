export interface MoviePick {
  title: string
  poster: string
  platform: string
  url: string
}

export interface MusicTrack {
  title: string
  artist: string
  spotifyId: string
}

export const moviePicks: MoviePick[] = [
  { title: "3 Idiots", poster: "/posters/3-idiots.jpg", platform: "Netflix", url: "https://www.netflix.com/in/title/70118422" },
  { title: "Oppenheimer", poster: "/posters/oppenheimer.jpg", platform: "Apple TV+", url: "https://tv.apple.com/in/movie/oppenheimer/umc.cmc.1a31z4g9k0j5x1y2z3" },
  { title: "Interstellar", poster: "/posters/interstellar.jpg", platform: "Apple TV+", url: "https://tv.apple.com/in/movie/interstellar/umc.cmc.xyz" },
  { title: "365 Days", poster: "/posters/365-days.jpg", platform: "Netflix", url: "https://www.netflix.com/in/title/81299985" },
  { title: "Attack on Titan", poster: "/posters/attack-on-titan.jpg", platform: "Netflix", url: "https://www.netflix.com/in/title/70299043" },
  { title: "Game of Thrones", poster: "/posters/game-of-thrones.jpg", platform: "JioHotstar", url: "https://www.hotstar.com/in/tv/game-of-thrones/166" },
  { title: "Demon Slayer", poster: "/posters/demon-slayer.jpg", platform: "Crunchyroll", url: "https://www.crunchyroll.com/series/GRDQ8WZ0Y" },
  { title: "House of the Dragon", poster: "/posters/house-of-the-dragon.jpg", platform: "JioHotstar", url: "https://www.hotstar.com/in/tv/house-of-the-dragon/1260138544" },
  { title: "Money Heist", poster: "/posters/money-heist.jpg", platform: "Netflix", url: "https://www.netflix.com/in/title/80192098" },
  { title: "When Life Gives You Tangerines", poster: "/posters/when-life-gives-you-tangerines.jpg", platform: "Netflix", url: "https://www.netflix.com/in/title/81727733" },
  { title: "Bloodhounds", poster: "/posters/bloodhounds.jpg", platform: "Netflix", url: "https://www.netflix.com/in/title/81656058" },
  { title: "Guns & Gulaabs", poster: "/posters/guns-and-gulaabs.jpg", platform: "Netflix", url: "https://www.netflix.com/in/title/81667603" },
  { title: "Silo", poster: "/posters/silo.jpg", platform: "Prime Video", url: "https://www.primevideo.com/detail/Silo/0QRXYZABCDEFGHIJKLMNOPQRST" },
  { title: "Pokémon", poster: "/posters/pokemon.jpg", platform: "JioHotstar", url: "https://www.hotstar.com/in/tv/pokemon/1260013555" },
  { title: "Dhurandhar", poster: "/posters/dhurandhar.jpg", platform: "Zee5", url: "https://www.zee5.com/web-series/dhurandhar" },
  { title: "The Bastards of Bollywood", poster: "/posters/bads-of-bollywood.jpg", platform: "Netflix", url: "https://www.netflix.com/in/title/81772202" },
]

export const musicTracks: MusicTrack[] = [
  { title: "Ishq Jalakar - Karvaan", artist: "Shashwat Sachdev, Shahzad Ali", spotifyId: "7d5TUdbJumBuBoaH33jyfo" },
  { title: "Surface", artist: "Aero Chord", spotifyId: "63bR379dNknfAws2hBBsq7" },
  { title: "Right Now (Na Na Na)", artist: "Akon", spotifyId: "5Ravsw8TmHN5wBiYPPYUFw" },
  { title: "Faded", artist: "Alan Walker", spotifyId: "698ItKASDavgwZ3WjaWjtz" },
  { title: "Darkhaast", artist: "Mithoon, Arijit Singh, Sunidhi Chauhan", spotifyId: "1awtp7rf6ajhGY9BgzCHeZ" },
  { title: "Samjhawan", artist: "Arijit Singh, Shreya Ghoshal", spotifyId: "0rk2X5TAhraBC5aCIXK2Rq" },
  { title: "Memories", artist: "Maroon 5", spotifyId: "4cktbXiXOapiLBMprHFErI" },
  { title: "Nuclear (Hands Up)", artist: "Zomboy", spotifyId: "32AV76N8GhpnJ74VoYfDGk" },
  { title: "Ore Manwa Re", artist: "Arijit Singh, Akriti Kakar", spotifyId: "0dNVDlHjA2fjn0yjTEamKa" },
  { title: "Piya O Re Piya", artist: "Atif Aslam, Shreya Ghoshal", spotifyId: "5a11x5PUFvJEadMRqtNtTr" },
  { title: "Aye Khuda", artist: "Salim Merchant", spotifyId: "1vgVsR5rkXGP4NmUcoroJH" },
  { title: "Thunder", artist: "Imagine Dragons", spotifyId: "1zB4vmk8tFRmM9UULNzbLB" },
  { title: "Replay", artist: "Iyaz", spotifyId: "4E5P1XyAFtrjpiIxkydly4" },
  { title: "Baby", artist: "Justin Bieber, Ludacris", spotifyId: "6epn3r7S14KUqlReYr77hA" },
  { title: "Lolly Pop Lageli", artist: "Pawan Singh", spotifyId: "07JB2QPqdFJOAh9d8U40Tr" },
  { title: "Speechless", artist: "Naomi Scott", spotifyId: "0XPsOSYzDJZJArevQNm2AR" },
]
