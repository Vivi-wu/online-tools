"use client";
import { Edit } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type Record = {[key: string]: number};
const records: Record = {
    "2024-04-12": 125,
    "2024-04-13": 10,
}

function countDays(records: Record) {
    return Object.keys(records).length;
}

function countMinutes(records: Record) {
    let total_time = 0;
    for (const key in records) {
        total_time += records[key];
    }
    return total_time;
}

// 从设置目标起，累计学习时长in 分钟
// 今日累计学习时长in 分钟
export default function DailyAttendancePage() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const [goal_desc, setGoal] = useState('');
    const [open, setOpen] = useState(false);
    // 今日累计学习时长
    const [td_total_time, setTdTotalTime] = useState(0);

    useEffect(() =>{
        let tmpStr = localStorage.getItem('goal_desc');
        if (tmpStr) {
            setGoal(tmpStr)
        }
    }, [])
    
    const handleClose = () => {
        setOpen(false);
    }

    const showCaseList = [
        {
            title: '累计打卡',
            value: countDays(records),
            unit: '天',
        },
        {
            title: '累计学习',
            value: countMinutes(records),
            unit: '分钟',
        },
        {
            title: '今日学习',
            value: td_total_time,
            unit: '分钟',
        },
    ]

    return <Container>
        <h2>{year}年{month}月{day}日</h2>
        <Box display='flex' alignItems='center' sx={{ mb: 1 }}>
            <Typography component="span">打卡目标：{goal_desc}</Typography>
            <IconButton aria-label="edit" size="small" onClick={() => setOpen(true)}>
                <Edit fontSize="inherit" />
            </IconButton>
        </Box>
        <Card>
            <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Grid container justifyContent="center" textAlign="center" spacing={0}>
                    {
                        showCaseList.map((item, index) => (
                            <Grid key={index} item xs={4}>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{item.title}</Typography>
                                <Box>
                                    <Typography component="span" sx={{ fontSize: 24 }}>{item.value}</Typography>
                                    <Typography component="span" sx={{ fontSize: 'small' }} color="text.secondary">{item.unit}</Typography>
                                </Box>
                            </Grid>
                        ))
                    }
                </Grid>
            </CardContent>
        </Card>
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    const desc = formJson.desc.trim();
                    // 不为空且与原目标不同时，更新本地存储
                    if (desc && desc !== goal_desc) {
                        localStorage.setItem('goal_desc', desc);
                        setGoal(desc);
                    }
                    handleClose();
                },
            }}
        >
            <DialogTitle>设定打卡目标</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    name="desc"
                    label="目标描述"
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined">关闭</Button>
                <Button type="submit" variant="contained">保存</Button>
            </DialogActions>
        </Dialog>
    </Container>
}
