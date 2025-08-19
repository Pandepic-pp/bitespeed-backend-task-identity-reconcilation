import { Request, Response } from "express";
import pool from "../db";

interface Result {
    contact: {
        primaryContactId: number,
        emails: string[],
        phoneNumbers: string[],
        secondaryContactIds: number[]
    }
}

interface RowResponse {
    id: number,
    phonenumber: string,
    email: string,
    linkedid: number | null,
    linkprecedence: "secondary" | "primary",
    createdat: Date,
    updatedat: Date,
    deletedat: Date | null
}

function responseHandler(rows: RowResponse[]): Result {
    const data: Result = {
        contact: {
            primaryContactId: 0,
            emails: [],
            phoneNumbers: [],
            secondaryContactIds: []
        }
    };

    rows.forEach((row) => {
        if(row.email && !data.contact.emails.includes(row.email)) {
            data.contact.emails.push(row.email);
        }
        if(row.phonenumber && !data.contact.phoneNumbers.includes(row.phonenumber)) {
            data.contact.phoneNumbers.push(row.phonenumber);
        }
        if (row.linkprecedence === "primary") {
            data.contact.primaryContactId = row.id;
        } else {
            data.contact.secondaryContactIds.push(row.id);
        }
    });

    return data;
}


export async function identifyContact(req: Request, res: Response) {
    try {
        let { email, phoneNumber } = req.body;
        if(!email) email = '##########';
        if(!phoneNumber) phoneNumber = '##########';

        let result = await pool.query(
            "select * from contact where email = $1 OR phoneNumber = $2",
            [email, phoneNumber]
        );

        if(phoneNumber === '##########') phoneNumber = null;
        if(email === '##########') email = null;

        if (result.rowCount === 0) {
            // No contact exists → create a primary
            result = await pool.query(
                "insert into contact (phoneNumber, email, linkPrecedence) values ($1, $2, $3) returning *",
                [phoneNumber, email, "primary"]
            );
        } 
        else {
            let isPhoneMatch = false;
            let isEmailMatch = false;
            let primaryIds: number[] = [];
            let primaryId: number;

            result.rows.forEach((row: RowResponse) => {
                if (row.linkprecedence === "primary") {
                    primaryIds.push(row.id);
                }
                if (row.email === email) isEmailMatch = true;
                if (row.phonenumber === phoneNumber) isPhoneMatch = true;
            });

            if(primaryIds.length === 0) {
                if(!isEmailMatch || !isPhoneMatch) await pool.query(
                    "insert into contact (phoneNumber, email, linkedid, linkprecedence) values ($1, $2, $3, $4)", 
                    [phoneNumber, email, result.rows[0].linkedid, 'secondary']
                )
                primaryId = result.rows[0].linkedid;
            }
            else if(primaryIds.length === 1) {
                if(!isEmailMatch || !isPhoneMatch) await pool.query(
                    "insert into contact (phoneNumber, email, linkedid, linkprecedence) values ($1, $2, $3, $4)", 
                    [phoneNumber, email, primaryIds[0], 'secondary']
                )
                primaryId = primaryIds[0];
            }
            else {
                primaryId = Math.min(...primaryIds);
                let secondaryId = Math.max(...primaryIds);
                await pool.query(
                    "update contact set linkprecedence = $1, linkedid = $2 where id = $3",
                    ['secondary', primaryId, secondaryId]
                )
            }

            // Fetch updated set
            result = await pool.query(
                "select * from contact where id = $1 or linkedid = $1",
                [primaryId]
            );
        }

        const data = responseHandler(result.rows);
        return res.json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
