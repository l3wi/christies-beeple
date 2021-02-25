require('dotenv').config()
const Discord = require('discord.js')
const fetch = require('isomorphic-fetch')

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const fetchSales = async (type, contract) => {
  const response = await fetch(
    `https://onlineonly.christies.com/ajax/poll?itemId=112924&currentPrice=1000000&lotStatus=Open&currentEnd=637510716000000000&currentAvailable=0&_=1614265947835`
  )
  const data = await response.json()
  return data.currentPrice
}

let currentBid = 0

const client = new Discord.Client()

client.on('ready', async function () {
  /// First load:
  currentBid = await fetchSales()

  setInterval(async () => {
    // console.log('Fetching Data')
    const rawBid = await fetchSales()

    if (rawBid != currentBid) {
      const embed = new Discord.MessageEmbed()
        .setColor('#f4e600')
        .setTitle(`New bid of $${numberWithCommas(rawBid)}`)
        .setURL(
          `https://onlineonly.christies.com/s/beeple-first-5000-days/beeple-b-1981-1/112924`
        )
        .setAuthor('EVERYDAYS: THE FIRST 5000 DAYS')
        // .setDescription(item.NiftyObject.description)
        .setThumbnail(
          'https://pbs.twimg.com/profile_images/264316321/beeple_headshot_beat_up_400x400.jpg'
        )
        .setTimestamp()

      client.channels.cache.get(process.env.CAHNNEL).send({ embed: embed })
      currentBid = rawBid
    }
  }, 10000)
})

client.login(process.env.TOKEN)
