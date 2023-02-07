const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const FastSpeedtest = require("fast-speedtest-api");

// https://api.fast.com/netflix/speedtest/v2?https=true&token=YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm&urlCount=5

const speedtest = new FastSpeedtest({
    token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // required
    verbose: false, // default: false
    timeout: 5000, // default: 5000
    https: true, // default: true
    urlCount: 5, // default: 5
    bufferSize: 8, // default: 8
    unit: FastSpeedtest.UNITS.Mbps, // default: Bps
});

const waitTime = 5000;

const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Some title")
    .setURL("https://discord.js.org/")
    .setAuthor({
        name: "Some name",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
        url: "https://discord.js.org",
    })
    .setDescription("Some description here")
    .setThumbnail("https://i.imgur.com/AfFp7pu.png")
    .addFields(
        { name: "Regular field title", value: "Some value here" },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
        { name: "Inline field title", value: "Some value here", inline: true }
    )
    .addFields({
        name: "Inline field title",
        value: "Some value here",
        inline: true,
    })
    .setImage("https://i.imgur.com/AfFp7pu.png")
    .setTimestamp()
    .setFooter({
        text: "Some footer text here",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
    });

const speedTestEmbed = (message) => {
    return new EmbedBuilder()
        .setColor(0xed1313)
        .setTitle(message)
        .setTimestamp()
        .setFooter({
            text: "fast.com",
            iconURL: "https://i.imgur.com/swzr6rj.png",
        });
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("speedtest")
        .setDescription("Check your internet speed"),
    async execute(interaction) {
        await interaction.deferReply();

        speedtest
            .getSpeed()
            .then(async (s) => {
                await interaction.editReply({
                    embeds: [speedTestEmbed(`Speed: ${s.toFixed(2)} Mbps`)],
                });
            })
            .catch(async (e) => {
                console.error(e.message);
                await interaction.editReply("error");
            });

        let time = 1000;

        const interval = setInterval(async () => {
            if (time >= waitTime) clearInterval(interval);
            await interaction.editReply({
                embeds: [
                    speedTestEmbed(`wait ${(waitTime - time) / 1000} seconds`),
                ],
            });

            time += 1000;
        }, 1000);
    },
};
