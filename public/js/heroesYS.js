const heroes = [
   {
      "id": 1,
      "name": "Wolvarine",
      "ico": "../images/Wolverine.png",
      "cost": 80,
      "attack": 50,
      "defence": 50
   },
   {
      "id": 2,
      "name": "Dazzler",
      "ico": "../images/Alison_Blaire.jpg",
      "cost": 30,
      "attack": 30,
      "defence": 20
   },
   {
      "id": 3,
      "name": "Iron Man",
      "ico": "../images/Anthony_Stark.jpg",
      "cost": 40,
      "attack": 40,
      "defence": 60
   },
   {
      "id": 4,
      "name": "Thing",
      "ico": "../images/Benjamin_Grimm.jpg",
      "cost": 30,
      "attack": 30,
      "defence": 20
   },
   {
      "id": 5,
      "name": "Black Panther",
      "ico": "../images/black_panter.jpg",
      "cost": 40,
      "attack": 50,
      "defence": 10
   },
   {
      "id": 6,
      "name": "Captain Britain",
      "ico": "../images/Brian_Braddock.jpg",
      "cost": 80,
      "attack": 70,
      "defence": 50
   },
   {
      "id": 7,
      "name": "Dormammu",
      "ico": "../images/dormammu.jpg",
      "cost": 90,
      "attack": 80,
      "defence": 70
   },
   {
      "id": 8,
      "name": "Beast",
      "ico": "../images/Henry_McCoy.jpg",
      "cost": 40,
      "attack": 30,
      "defence": 50
   },
   {
      "id": 9,
      "name": "Jean Grey",
      "ico": "../images/Jean_Grey.jpg",
      "cost": 60,
      "attack": 60,
      "defence": 50
   },
   {
      "id": 10,
      "name": "She-hulk",
      "ico": "../images/Jennifer_Walters.jpg",
      "cost": 30,
      "attack": 50,
      "defence": 10
   },
   {
      "id": 11,
      "name": "Johnathan_Storm",
      "ico": "../images/Johnathan_Storm.jpg",
      "cost": 50,
      "attack": 50,
      "defence": 20
   },
   {
      "id": 12,
      "name": "Nightcrawler",
      "ico": "../images/Kurt_Wagner.jpg",
      "cost": 30,
      "attack": 40,
      "defence": 10
   },
   {
      "id": 13,
      "name": "Luke Cage",
      "ico": "../images/Luke_Cage.jpg",
      "cost": 50,
      "attack": 40,
      "defence": 60
   },
   {
      "id": 14,
      "name": "Matthew Murdock",
      "ico": "../images/Matthew_Murdock.jpg",
      "cost": 30,
      "attack": 40,
      "defence": 20
   },
   {
      "id": 15,
      "name": "May Parker",
      "ico": "../images/May_Parker.jpg",
      "cost": 10,
      "attack": 10,
      "defence": 10
   },
   {
      "id": 16,
      "name": "Mr. Marvel",
      "ico": "../images/mr_marvel.jpeg",
      "cost": 70,
      "attack": 70,
      "defence": 50
   },
   {
      "id": 17,
      "name": "Fury",
      "ico": "../images/Nicholas_Fury.jpg",
      "cost": 30,
      "attack": 30,
      "defence": 10
   },
   {
      "id": 18,
      "name": "Norrin Radd",
      "ico": "../images/Norrin_Radd.jpg",
      "cost": 40,
      "attack": 60,
      "defence": 20
   },
   {
      "id": 19,
      "name": "Spider-Man",
      "ico": "../images/Peter_Parker.jpg",
      "cost": 50,
      "attack": 50,
      "defence": 50
   },
   {
      "id": 20,
      "name": "Colossus",
      "ico": "../images/Piotr_Rasputin.jpg",
      "cost": 60,
      "attack": 50,
      "defence": 70
   },
   {
      "id": 21,
      "name": "Phoenix",
      "ico": "../images/Rachel_Summers.jpg",
      "cost": 70,
      "attack": 80,
      "defence": 50
   },
   {
      "id": 22,
      "name": "Mister Fantastic",
      "ico": "../images/Reed_Richards.jpg",
      "cost": 30,
      "attack": 50,
      "defence": 10
   },
   {
      "id": 23,
      "name": "Hulk",
      "ico": "../images/Robert_Bruce_Banner(hulk).jpg",
      "cost": 80,
      "attack": 70,
      "defence": 60
   },
   {
      "id": 24,
      "name": "Iceman",
      "ico": "../images/Robert_Drake.jpg",
      "cost": 30,
      "attack": 50,
      "defence": 10
   },
   {
      "id": 25,
      "name": "Rogue",
      "ico": "../images/Rogue.jpg",
      "cost": 60,
      "attack": 60,
      "defence": 60
   },
   {
      "id": 26,
      "name": "Cyclops",
      "ico": "../images/Scott_Summers.jpg",
      "cost": 30,
      "attack": 50,
      "defence": 10
   },
   {
      "id": 27,
      "name": "Doctor Strange",
      "ico": "../images/Stephen_Strange.jpg",
      "cost": 50,
      "attack": 60,
      "defence": 50
   },
   {
      "id": 28,
      "name": "Capitain America",
      "ico": "../images/Steven_Rogers.jpg",
      "cost": 50,
      "attack": 40,
      "defence": 60
   },
   {
      "id": 29,
      "name": "Storm",
      "ico": "../images/Storm.jpg",
      "cost": 40,
      "attack": 50,
      "defence": 20
   },
   {
      "id": 30,
      "name": "Invisible Woman",
      "ico": "../images/Susan_Storm.jpg",
      "cost": 30,
      "attack": 40,
      "defence": 20
   },
   {
      "id": 31,
      "name": "Dagger",
      "ico": "../images/Tandy_Bowen.jpg",
      "cost": 40,
      "attack": 30,
      "defence": 50
   },
   {
      "id": 32,
      "name": "Thanos",
      "ico": "../images/Thanos.jpg",
      "cost": 90,
      "attack": 100,
      "defence": 80
   },
   {
      "id": 33,
      "name": "Thor",
      "ico": "../images/Thor_Odinson.jpg",
      "cost": 70,
      "attack": 70,
      "defence": 70
   },
   {
      "id": 34,
      "name": "Archangel",
      "ico": "../images/Warren_Worthington_III.jpg",
      "cost": 40,
      "attack": 60,
      "defence": 30
   },
   {
      "id": 35,
      "name": "Venum",
      "ico": "../images/Peter_Parker_Venum.jpg",
      "cost": 60,
      "attack": 60,
      "defence": 50
   }, {
      "id": 36,
      "name": "Havok",
      "ico": "../images/Alexander_Summers.jpg",
      "cost": 10,
      "attack": 10,
      "defence": 20
   }
]