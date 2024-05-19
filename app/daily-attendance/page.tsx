"use client";
import { AddTaskSharp, Edit } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Slider, TextField, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";

type Record = {[key: string]: number};

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
function getTimeByDate(dateStr: string, records: Record) {
    return records[dateStr] || 0
}

const PrettoSlider = styled(Slider)({
    color: '#52af77',
    height: 8,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&::before': {
        display: 'none',
      },
    },
});

// 从设置目标起，累计学习时长in 分钟
// 今日累计学习时长in 分钟
export default function DailyAttendancePage() {
    const today = new Date();
    const tdDateStr = today.toLocaleDateString('zh-CN');
    const todayStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    const [records, setRecords] = useState<Record>({});
    const td_total_time = getTimeByDate(tdDateStr, records);
    // 今日累计学习时长
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
    ];

    const [goal_desc, setGoal] = useState('');
    useEffect(() =>{
        let tmpStr = localStorage.getItem('goal_desc');
        if (tmpStr) {
            setGoal(tmpStr)
        }
        let tmpObj = localStorage.getItem('records');
        if (tmpObj) {
            setRecords(JSON.parse(tmpObj));
        }
    }, [])
    
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    }

    const [value, setValue] = useState(0);
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    };
    const handleCheckClick = () => {
        let val = value + td_total_time
        let newRecord = {...records, [tdDateStr]: val};
        setRecords(newRecord);
        localStorage.setItem('records', JSON.stringify(newRecord));
    }

    return <Container>
        <Typography component="h2" sx={{ mb: 2, mt: 3, fontSize: '2rem' }}>{todayStr}</Typography>
        <Box display='flex' alignItems='center' sx={{ mb: 2 }}>
            <Typography component="span">目标：{goal_desc}</Typography>
            <IconButton aria-label="edit" size="small" onClick={() => setOpen(true)}>
                <Edit fontSize="inherit" />
            </IconButton>
        </Box>
        <Card>
            <CardContent sx={{ '&:last-child': { pb: 2, pt: 3 } }}>
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
        <Box sx={{ mt: 4, px: 2 }}>
            <Typography variant="h6">真棒，又完成了{value}分钟的目标！</Typography>
            <Box sx={{ mt: 2 }}>
                <PrettoSlider
                    value={typeof value === 'number' ? value : 0}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                />
            </Box>
        </Box>
        <Box sx={{ mt: 3 }} textAlign='center'>
            <IconButton sx={{ color: value > 0 ? '#52af77' : 'default' }} aria-label="add time" onClick={handleCheckClick}>
                <AddTaskSharp sx={{ fontSize: '10rem' }} />
            </IconButton>
        </Box>
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
