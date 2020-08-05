import {Request, Response} from 'express'

import db from '../database/connection';
import convertHoursToMinutes from '../utils/convertHoursToMinutes';

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassController {
    async index(req : Request, res : Response) {
        const filters = req.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if(!filters.week_day || !filters.subject || !filters.time) {
            return res.status(400).json({
                error: "Missing filter to search classes"
            })
        }

        const timeInMinutes = convertHoursToMinutes(time);
        
        const classes = await db('class')
            .whereExists(function() {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `class`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('class.subject', '=', subject)
            .join('user', 'class.user_id', '=', 'user.id')
            .select(['class.*', 'user.*']);

        return res.json(classes);
    }

    async create(req : Request, res : Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = req.body;
    
        const trx = await db.transaction();
    
        try {
            const insertedUserIds = await trx('user').insert({
                name,
                avatar,
                whatsapp,
                bio
            })
        
            const user_id = insertedUserIds[0];
        
            const inserterdClassesId = await trx('class').insert({
                subject,
                cost,
                user_id
            })
        
            const class_id = inserterdClassesId[0];
        
            const classSchedule = schedule.map((scheduleItem : ScheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHoursToMinutes(scheduleItem.from),
                    to: convertHoursToMinutes(scheduleItem.to)
                }
            })
        
            await trx('class_schedule').insert(classSchedule);
        
            await trx.commit();
        
            return res.sendStatus(201);
        }catch (err) {
            await trx.rollback();
            return res.status(400).json({
                error: "Unexpected error while creating new class"
            })
        }
    }
}