import cheerio from 'cheerio'
import axios from 'axios'

/**
 * Scraps news from the given URL or ID of the news from MyAnimeList
 * @param {number | string} query The URL or ID of the news
 * @returns {Promise<INews>} The contents of the news page
 * @example
 * const query = 66853767 // 'https://myanimelist.net/news/66853767'
 * scrapNews(query)
 */
export const scrapNews = async (query: string | number): Promise<INews> => {
    if (!query) throw new TypeError(`'query' parameter shouldn't be undefined`)
    const url =
        typeof query === 'string' && query.includes('myanimelist.net/news/')
            ? `https://myanimelist.net/news/${query.split('/')[query.split('/').length - 1]}`
            : `https://myanimelist.net/news/${query}`
    return await axios
        .get(url)
        .then(({ data }) => {
            const $ = cheerio.load(data)
            const title = $('#content > div.content-left > div > div:nth-child(2) > div > h1 > a').text()
            const id = url.split('/')[url.split('/').length - 1]
            const image =
                $('#content > div.content-left > div > div:nth-child(2) > div > div.content.clearfix')
                    .find('img')
                    .attr('src') || 'https://i.imgur.com/Q8af0QU.jpg'
            const description = $('#content > div.content-left > div > div:nth-child(2) > div > div.content.clearfix')
                .text()
                .replace('\n    \n', '')
                .trim()
            return {
                id,
                url,
                image,
                description,
                title
            }
        })
        .catch((err) => {
            throw new Error(err.message)
        })
}

export interface INews {
    id: string
    url: string
    image: string
    description: string
    title: string
}
