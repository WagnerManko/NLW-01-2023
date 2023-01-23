import { generateDateFromYearBeginning } from "../utils/generate-date-from-year-beginning"
import { HabitDay } from "./HabitDay"
import { api } from '../lib/axios'
import { useEffect, useState } from "react"
import dayjs from "dayjs"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDateFromYearBeginning()
const minimumSummaryDatesSize = 18 * 7
const amountofDaysToFill = minimumSummaryDatesSize - summaryDates.length

type Summary = {
    id: string;
    date: string;
    amount: number;
    completed: number;
}[]

export function SummaryTable() {
    const [summary, setSummary] = useState<Summary>([])

    useEffect(() => {
        api.get('summary').then(response => {
            setSummary(response.data)
        })
    }, [])

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3 items-center">
                {weekDays.map((day, i) => (
                    <div key={`${day}-${i}`} className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summary.length > 0 && summaryDates.map(date => {
                    const  dayInSummary = summary.find(day=> {
                        return dayjs(date).isSame(day.date, 'day')
                    })

                    return <HabitDay key={date.toString()} date={date} amount={dayInSummary?.amount} defaultCompleted={dayInSummary?.completed} />
                })}

                {amountofDaysToFill > 0 && Array.from({length: amountofDaysToFill}).map((_, i) => {
                    return (
                        <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg cursor-not-allowed opacity-40"></div>
                    )
                })}
            </div>
        </div>
    )
}