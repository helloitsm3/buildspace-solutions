import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { StudentIntro } from '../models/StudentIntro'

const STUDENT_INTRO_PROGRAM_ID = 'HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf'

export const StudentIntroList: FC = () => {
    const [studentIntros, setStudentIntros] = useState<StudentIntro[]>([])

    useEffect(() => {
        setStudentIntros(StudentIntro.mocks)
    }, [])
    
    return (
        <div>
            {
                studentIntros.map((studentIntro, i) => <Card key={i} studentIntro={studentIntro} /> )
            }
        </div>
    )
}