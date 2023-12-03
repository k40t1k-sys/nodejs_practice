#!/usr/bin/env node

import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
})

const url = "http://quotes.rest/qod?api_key=" + process.env.API_KEY;

axios({
    method: 'get',
    url: url,
    headers: { 'Accept': 'application/json' },
}).then(res => {
    const quote = res.data.contents.quotes[0].quote
    const author = res.data.contents.quotes[0].author
    const log = chalk.green(`${quote} - ${author}`)

    console.log(log)
}).catch(err => {
    const log = chalk.red(err)
    console.log(err)
})

// console.log(process.env.API_KEY);