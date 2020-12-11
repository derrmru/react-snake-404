import React, { useEffect, useState, useRef } from 'react';
import './Snake.css';

const Snake: React.FC = () => {
    const [dim, setDim] = useState<number>(0);
    const [chunk, setChunk] = useState<number>(0);
    const [direction, setDirection] = useState('right');
    const [fruit, setFruit] = useState<number>(26);
    const [points, setPoints] = useState<number>(0);
    const width: number = window.innerWidth;
    const countRef = useRef(0);
    const speedRef = useRef(100);
    const [snake, setSnake] = useState<any>([
        {
            direction: 'right', 
            part: [186, 185, 184, 183]
        }
    ]);

    const pieces = () => {//functionally label snake pieces (bang) and return
        let arr = [];
        for (let i = 0; i < 400; i++) {
            let addToArr: boolean = false;
            let j = 0;
            while (j < snake.length) {
                if (snake[j].part.indexOf(i) >= 0) {
                    addToArr = true
                    break;
                 } else {
                    addToArr = false
                 }
                j++
            }
            addToArr ? 
                arr.push('bang') : 
                    i === fruit ? arr.push('fruit') :
                        arr.push('')
        }
        return arr
    }

    useEffect(() => {
        //determine relative dimensions of game portal
        if (width >= 800) {
            setDim(width * .35)
        } else if (width < 800) {
            setDim(width * .9);
        }
        setChunk(dim / 20)

        //points
        if (snake[0].part[0] === fruit) {
            setPoints(points + 1)
            let sneak = [...snake];
            let firstSection = sneak[0]
            if (firstSection.direction === 'up') {
                let y = firstSection.part[0] - 20;
                if (y < 0) {
                    firstSection.part.unshift(y + 400);
                } else {
                    firstSection.part.unshift(y)
                }
            } else if (firstSection.direction === 'right') {
                let y = firstSection.part[0] + 1;
                if (y % 20 === 0) {
                    firstSection.part.unshift(y + - 20);
                } else {
                    firstSection.part.unshift(y)
                }
            } else if (firstSection.direction === 'down') {
                let y = firstSection.part[0] + 20;
                if (y >= 400) {
                    firstSection.part.unshift(y - 400);
                } else {
                    firstSection.part.unshift(y)
                }
            } else if (firstSection.direction === 'left') {
                let y = firstSection.part[0] - 1;
                if (y % 20 === 19) {
                    firstSection.part.unshift(y + 20);
                } else {
                    firstSection.part.unshift(y)
                }
            }
            console.log(sneak)
            setSnake(sneak)
            setFruit(Math.floor(Math.random() * Math.floor(400)))
        }

        //listen for directions and update snake instructions accordingly
        const handleKeydown = (e: any) => {
            let tempSnake: any = [...snake];
            switch (e.code) {
                case 'ArrowUp':
                    if (direction !== 'down' && direction !== 'up') {
                        setDirection('up')
                        tempSnake.unshift({
                            direction: 'up',
                            part: []
                        })
                    }
                    break;
                case 'ArrowRight':
                    if (direction !== 'left' && direction !== 'right') {
                        setDirection('right')
                        tempSnake.unshift({
                            direction: 'right',
                            part: []
                        })
                    }
                    break;
                case 'ArrowDown':
                    if (direction !== 'up' && direction !== 'down') {
                        setDirection('down')
                        tempSnake.unshift({
                            direction: 'down',
                            part: []
                        })
                    }
                    break;
                case 'ArrowLeft':
                    if (direction !== 'right' && direction !== 'left') {
                        setDirection('left')
                        tempSnake.unshift({
                            direction: 'left',
                            part: []
                        })
                    }
                    break;
            }
            setSnake(tempSnake)
        }
        document.addEventListener('keydown', handleKeydown)

        //event interval
        const interval = setInterval(() => {
            countRef.current += 1

            //handle snake piece movement
            let dupSneak: any = [...snake];

            for (let i = (snake.length - 1); i > 0; i--) {//increment through current snake and reduce to head direction
                if (dupSneak[i].part.length !== 0) {
                    let next = dupSneak[i - 1];
                    let chunk = dupSneak[i].part.shift();
                    next.part.push(chunk)
                } else {
                    dupSneak.pop()
                }
            }

            //perform movement changes to each chunk
            let sneak: any[] = dupSneak;
            sneak.map((section: any) => {
                if (section.direction === 'right') {
                    section.part.map((x: number, i: number) => {
                        let y = x + 1;
                        if (y % 20 === 0) {
                            return section.part[i] = y - 20;
                        } else {
                            return section.part[i] = y
                        }
                    })
                } else if (section.direction === 'up') {
                    section.part.map((x: number, i: number) => {
                        let y = x - 20;
                        if (y < 0) {
                            return section.part[i] = y + 400;
                        } else {
                            return section.part[i] = y
                        }
                    })
                } else if (section.direction === 'left') {
                    section.part.map((x: number, i: number) => {
                        let y = x - 1;
                        if (y % 20 === 19) {
                            return section.part[i] = y + 20;
                        } else {
                            return section.part[i] = y
                        }
                    })
                } else if (section.direction === 'down') {
                    section.part.map((x: number, i: number) => {
                        let y = x + 20;
                        if (y >= 400) {
                            return section.part[i] = y - 400;
                        } else {
                            return section.part[i] = y
                        }
                    })
                }
                return ''
            })
            setSnake(sneak)

            //incrementally speed up every minute
            if (countRef.current % 600 === 0) {
                speedRef.current = speedRef.current - 10
            }
        }, speedRef.current);

        //remove interval and listeners
        return () => {
            clearInterval(interval)
            document.removeEventListener('keydown', handleKeydown)
        };
    }, [width, dim, chunk, snake, direction, points, fruit])

    return (
        <div className="snake-container">
            <div   
                className="game-border"
                style={{width: dim, height: dim}}
                >
                    {
                        pieces().map((piece, i) => {
                            return <div
                                key={'piece' + i}
                                style={piece === 'bang' ? 
                                        {width: chunk, height: chunk, backgroundColor: '#248ec2'} : 
                                            piece === 'fruit' ?
                                                {width: chunk, height: chunk, backgroundColor: 'red'} :
                                                    {width: chunk, height: chunk}}
                                >
                            </div>
                        })
                    }
            </div>
            <div 
                className="point-bar"
                style={{width: dim}}
                >
                    Score: {points}
            </div>
        </div>
    )
}

export default Snake