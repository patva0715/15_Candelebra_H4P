import { Box, Button, Divider, OutlinedInput, Paper, Tab, Tabs, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toLocale, getColor } from '../utils'
import ChartContainer from './ChartContainer';
import { darken, lighten } from '@mui/material/styles'
import { theme } from '../themes/theme'
import { Socket } from 'socket.io-client';

const Chart = ({ socket, tick: { ticker, name, color, initialPrice, data: dataFromServer, currentPrice: curr }, portfolio, cash, setPortfolio, setCash }) => {
    const [intent, setIntent] = useState(1)
    const [avgCost, setAvgCost] = useState(0)
    const [shares, setShares] = useState(0)
    const [day, setDay] = useState(0)
    const [data, setData] = useState([])
    const [target, setTarget] = useState(initialPrice + .6 * initialPrice)
    const [volatility, setVolatility] = useState(2)
    const [currentPrice, setCurrentPrice] = useState(0)
    const [range, setRange] = useState('max')
    const [play, setPlay] = useState(true)
    const [max, setMax] = useState(0)
    const [dataFilled, setDataFilled] = useState(false)

    // const handleRangeChange = (e) => {
    //     // console.log(e.target.value)
    //     if (e.target.value === 'max') setRange('max')
    //     else setRange(Number(e.target.value))
    // }
    // const handleClick = () => {
    //     setDay(state => state + 1)
    // }

    // const handleNews = (news) => {
    //     // console.log(news)
    //     if (Math.random() > news.chance) {
    //         // console.log('News did not pass', news.desc)
    //         return
    //     } else {
    //         // console.log('News pass', news.desc)
    //         let posTarget = Number(target) + news.target
    //         let posVol = Number(volatility) + news.vlty
    //         if (posTarget > 100) {
    //             setTarget(posTarget)
    //             setCurrentPrice(state => state + news.init)
    //         }
    //         if (posVol > 1 && posVol < 10) setVolatility(posVol)
    //         return
    //     }
    // }
    // useEffect(() => {
    //     // console.log('setting Interval')
    //     const interval = setInterval(() => {
    //         if (play) handleClick()
    //     }, 300);
    //     //200 back
    //     const Newsinterval = setInterval(() => {
    //         let ran = Math.ceil((Math.random() * news.length)) - 1
    //         // if (play) console.log(ran)
    //         if (play) handleNews(news[ran])
    //     }, 1000);
    //     return () => {
    //         // console.log('cleaning up intervals')
    //         clearInterval(interval);
    //         clearInterval(Newsinterval)
    //     }
    // }, [play])

    //RUN THIS EVERY TICK
    // useEffect(() => {


    //     //CALCULATE NEW PRICE HERE
    //     const percent = ((target - currentPrice) / target) * 100
    //     // console.log(percent.toFixed(2), "% away from target")

    //     const aNum = Math.random() * 100

    //     let multiplier
    //     if (percent + 20 > aNum) {
    //         multiplier = 1
    //     } else {
    //         multiplier = -1
    //     }
    //     const deltaPercent = (Math.random() * volatility) / 100

    //     const newPrice = (currentPrice + currentPrice * deltaPercent * multiplier)
    //     //END CALCULATE NEW PRICE HERE

    //     //CALCULATE NEW PORTFOLIO VALUE
    //     let newObj = { ...portfolio }
    //     newObj[ticker] = { value: newPrice * shares, shares: shares, avgCost: avgCost }
    //     setPortfolio(newObj)
    //     //END CALCULATE NEW PORTFOLIO VALUE

    //     setCurrentPrice(newPrice)
    //     const obj = { name: day, uv: newPrice, pv: 2400, amt: 2400 }
    //     setData(state => [...state, obj])
    // }, [day]);
    // const mock = [{ name: 1, uv: 400, pv: 2400, amt: 2400 }, { name: 'Page A', uv: 100, pv: 2400, amt: 2400 }, { name: 'Page A', uv: 400, pv: 2400, amt: 2400 }, { name: 'Page A', uv: 400, pv: 2400, amt: 2400 }, { name: 'Page A', uv: 400, pv: 2400, amt: 2400 }, { name: 'Page A', uv: 400, pv: 2400, amt: 2400 }]

    const modifyData = (tickData) => {

    }
    useEffect(() => {
        console.log('in ui')
        let ar = Object.values(dataFromServer)
        setData(ar)
        setDataFilled(true)
        // console.log('dataFromServer:',dataFromServer)
    }, [dataFromServer])
    useEffect(() => {
        socket.current.on(ticker, (tickData) => {
            setCurrentPrice(Number(tickData))
           
        })
    }, [dataFilled])
    useEffect(()=>{
        if(dataFilled){
            let arr = [...data]
            console.log('ARR', arr)
            let obj = arr.reduceRight((a,v)=>({ ...a, [v.name]: v}), {}) 
            // let obj = Object.assign({}, arr); // {0:"a", 1:"b", 2:"c"}
            let keys = Object.keys(obj)

            let newIndex = Number(keys[keys.length-1])+1
            // newIndex++
            console.log('Index: ',newIndex)
            let letNewName=Number(obj[keys[keys.length-1]].name)+1
            // letNewName++
            console.log('Name: ',letNewName)
            let objInsert = { name: letNewName, uv: Number(Number(currentPrice).toFixed(2)), pv: 2400, amt: 2400 }
            if (keys.length >= 1000) {
                delete obj[keys[0]]
            }
            obj[newIndex] = objInsert
 

            let ar2 = Object.values(obj)
            setData(ar2)
        }
    },[currentPrice])

    return (
        <>
            <Box sx={{ p: 2, width: { xs: '100%', md: '50%' }, }}>
                <Paper elevation={4} sx={{ display: 'flex', p: 1, flexDirection: 'column' }} >
                    {/* =====HEADER============================================== */}
                    <Box>
                        <Typography variant='h3' color={color} fontWeight='600'>{ticker}</Typography>
                        <Typography variant='body1' color='grey.400'>{name}</Typography>
                        <Typography variant='h6' color='green' fontWeight='600'>${toLocale(currentPrice)}</Typography>
                        {/* <Typography variant='body1' color='success'>TARGET: ${target}</Typography> */}
                        {/* <Typography variant='body1' color='success'>volatility: {volatility}</Typography> */}
                    </Box>
                    {/* =====HEADER============================================== */}

                    {/* =====CHART=============================================== */}
                    {/* <LineChart width={600} height={300} data={data.slice(-range)}> */}
                    {/* <Line type="monotone" dataKey="uv" stroke="#8884d8" isAnimationActive={false} dot={false}/> */}
                    {/* </LineChart> */}
                    <Box display='block' sx={{}}>
                        <ChartContainer data={data} range={range} color={color} />
                    </Box>
                    {/* =====END CHART=============================================== */}

                    {/* =====BUTTONS=============================================== */}
                    <Box display='flex' sx={{ ml: 2, gap: 1 }}>
                        {/* <Button onClick={() => setRange(28)}>7</Button> */}
                        {/* <Button value={28} sx={{ color: `${range === 28 ? color : '#444'}`, minWidth: '45px', p: '0' }} onClick={handleRangeChange}>1w</Button> */}
                        {/* <Button value={120} sx={{ color: `${range === 120 ? color : '#444'}`, minWidth: '45px', p: '0' }} onClick={handleRangeChange}>1m</Button> */}
                        {/* <Button value={360} sx={{ color: `${range === 360 ? color : '#444'}`, minWidth: '45px', p: '0' }} onClick={handleRangeChange}>3m</Button> */}
                        {/* <Button value={'max'} sx={{ color: `${range === 'max' ? color : '#444'}`, minWidth: '45px', p: '0' }} onClick={handleRangeChange}>max</Button> */}
                    </Box>

                    {/* =====END BUTTONS============================================= */}

                    <Divider sx={{ my: 2 }} />

                    {/* =====BUY BUTTONS=============================================== */}
                    <Box display='flex' sx={{ alignItems: 'center', px: 2 }}>
                        <Box sx={{ flexGrow: '1' }}>
                            <Box display='flex' sx={{ width: 'min-content', p: 1, gap: 1, borderRadius: 2, alignItems: 'flex-end', bgcolor: lighten(getColor(color), .8) }}>
                                <Typography variant='h4' color={color}>{shares}</Typography>
                                <Typography variant='body1' color={color} >shares</Typography>
                            </Box>
                        </Box>
                        <Box display='flex' sx={{ gap: 1 }}>
                            <Button color='error' variant='outlined' size='small' sx={{ minWidth: '40px', p: '5px 10px', flexGrow: '1' }} onClick={() => {
                                if (shares - intent < 0) return
                                setShares(state => state - 1)
                                setCash(state => state + currentPrice * 1)
                            }}>
                                Sell
                            </Button>
                            <OutlinedInput value={intent} onChange={(e) => setIntent(e.target.value)} inputProps={{ style: { padding: '5px', width: '40px', textAlign: 'center' } }} sx={{ padding: '0px', height: '40px' }}></OutlinedInput>
                            <Button color='success' variant='outlined' size='small' sx={{ minWidth: '40px', p: '5px 10px', flexGrow: '1' }} onClick={() => {
                                let tot = intent * currentPrice
                                if (tot > cash) return
                                setShares(state => state + 1)
                                const avg = ((avgCost * shares) + (currentPrice * 1)) / (shares + 1)
                                setAvgCost(Number(avg))
                                setCash(state => (state - currentPrice * 1))
                            }}>
                                Buy
                            </Button>
                        </Box>
                        {/* <input type='number' value={target} onChange={(e) => setTarget(e.target.value)} /> */}
                        {/* <Button onClick={() => handleNews(news[4])}>PUSH NEWS</Button> */}
                        {/* <Button onClick={() => setPlay(state => !state)}>Play/Stop</Button> */}

                        {/* <Button onClick={() => setVolatility(state => state + 1)}>Increase volatility</Button>
            <Button onClick={() => setVolatility(state => state - 1)}>Decrease volatility</Button> */}

                        {/* <Typography variant='body1'>AVG PRICE: ${((avgCost).toLocaleString())}</Typography>
                        <Typography variant='body1'>POSITION: ${(shares * currentPrice).toFixed(2)}</Typography>
                        <Typography variant='body1'>PROFIT/LOSS: ${((shares * currentPrice) - (shares * avgCost)).toLocaleString()}</Typography> */}
                    </Box>

                </Paper>
            </Box>
        </>
    )
};


export default Chart;
