/*
 Navicat Premium Data Transfer

 Source Server         : mongo
 Source Server Type    : MongoDB
 Source Server Version : 40404
 Source Host           : localhost:27017
 Source Schema         : igirl

 Target Server Type    : MongoDB
 Target Server Version : 40404
 File Encoding         : 65001

 Date: 04/12/2021 11:01:36
*/


// ----------------------------
// Collection structure for nfts
// ----------------------------
db.getCollection("nfts").drop();
db.createCollection("nfts");

// ----------------------------
// Documents of nfts
// ----------------------------
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a9263356ca62355ced3782"),
    minted: false,
    tokenUri: "QmYEzKHwRHeqyinwxYoraY45KP2cBftpFaDySH1NHwsHwx",
    rarity: "Basic",
    __v: NumberInt("0")
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a926eb5e3b0000f0001b92"),
    minted: false,
    tokenUri: "QmXzAPCZ2texBYSQvi8ufnXT3k4tAZ6nKF45tPTZtYQA4E",
    rarity: "Basic"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a927055e3b0000f0001b93"),
    rarity: "Basic",
    minted: false,
    tokenUri: "QmNqLPfPM3TqW3YoUa4kQYm5GDWBoBDqvsmy9vxWDkfS2x"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a927065e3b0000f0001b94"),
    rarity: "Basic",
    minted: false,
    tokenUri: "QmQvLSkCYpx5JV1cF4vmiRZGNUyJogLMQbPDEj79k4BgJ6"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a927075e3b0000f0001b95"),
    rarity: "Basic",
    minted: false,
    tokenUri: "QmbJ6Cgk2ZLU6JRNWidBPPnpNn9Q3HnHo3qkCmrg82sy4h"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a927095e3b0000f0001b96"),
    rarity: "Basic",
    minted: true,
    tokenUri: "QmVSDQRZry1cVJ7iGRz1oBt6yvGBLeDFogRAt2Gh2EcYyQ"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a929625e3b0000f0001b97"),
    minted: false,
    rarity: "Rare",
    tokenUri: "Qmbx8YsrDuMk7ermEwXUfci3eHGybN4RgoeW7MbgJ4iRgf"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a929655e3b0000f0001b98"),
    minted: false,
    rarity: "Rare",
    tokenUri: "QmRY8XVVEyUyciaj53dHnrvakBaTJa9fXJLwXNs6RmoaDh"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a929675e3b0000f0001b99"),
    minted: false,
    rarity: "Rare",
    tokenUri: "QmbHJ27Hn8znx4tr3tuweGcLXUTmse3MiURrKNP6wUE2EB"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a9296a5e3b0000f0001b9a"),
    minted: false,
    rarity: "Rare",
    tokenUri: "Qmcs644rBVzeFYHwKGdPb6juhfjoq3NYm7NqBbV5AQ8A3K"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a9296b5e3b0000f0001b9b"),
    minted: true,
    rarity: "Rare",
    tokenUri: "QmT69oTgbHWEtzQdLfy7YwEZHK6ssZQdZgU7gK9SuXLxDy"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a9296f5e3b0000f0001b9c"),
    minted: false,
    rarity: "Epic",
    tokenUri: "QmYAczHV5EjTymyj73GMZsLJ3hFFYB6gfvuvd869hFKEa2"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a929715e3b0000f0001b9d"),
    minted: true,
    rarity: "Epic",
    tokenUri: "QmPE2osmN9NfUZy6jMiR2fVm7esqyx1Rga2uENdpJFL4zw"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a929725e3b0000f0001b9e"),
    minted: true,
    rarity: "Epic",
    tokenUri: "QmSvQnKiXZ9JEBdSU1h6GyHPXo3pMwPPYxGLyvdY8XVnJG"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a929745e3b0000f0001b9f"),
    minted: false,
    rarity: "Epic",
    tokenUri: "QmWMwTPkX8RtMGWhHW3BjuqoEruXdwteQ35d2cDedg2zVf"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a929795e3b0000f0001ba0"),
    minted: false,
    rarity: "Legndry",
    tokenUri: "Qmej7brx7qXsjSM5KkDTZJMwRva1KzhMsg1Gga6DXnA6Ys"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a9297d5e3b0000f0001ba1"),
    minted: false,
    rarity: "Legndry",
    tokenUri: "QmQ69hUrsR69jFEYnKj5u8bpyPNV7the4cbdPNupRjKCAN"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a9297e5e3b0000f0001ba2"),
    minted: true,
    rarity: "Legndry",
    tokenUri: "QmQzHo444fCod2UJ63g73LBn4jMP2crBUCQEKBj7jssom3"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a929815e3b0000f0001ba3"),
    minted: false,
    rarity: "Mythical",
    tokenUri: "QmTCnLJ3DGqGQwVDV8ZyW3qKUNpNczgpPB946n9D6uQNzK"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a929835e3b0000f0001ba4"),
    minted: false,
    rarity: "Mythical",
    tokenUri: "QmXnQLcwSDgnmM62KVpLF5snbzQE1x5Mytv1ZV1C4fvbnV"
} ]);
db.getCollection("nfts").insert([ {
    _id: ObjectId("61a929855e3b0000f0001ba5"),
    minted: false,
    rarity: "God",
    tokenUri: "Qmd2YzTN7Rcgp3XpPCQkEUh61drSE2y6QaDeQbrmRir2Jr"
} ]);
