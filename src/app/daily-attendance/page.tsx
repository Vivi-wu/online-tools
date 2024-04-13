"use client";
import { Edit } from "@mui/icons-material";
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// 从设置目标起，累计学习时长in 分钟
// 今日累计学习时长in 分钟
export default function DailyAttendancePage() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const [goal_desc, setGoal] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() =>{
        let tmpStr = localStorage.getItem('goal_desc');
        if (tmpStr) {
            setGoal(tmpStr)
        }
    }, [])
    
    const handleClose = () => {
        setOpen(false);
    }

    return <Container>
        <h2>{year}年{month}月{day}日</h2>
        <Box display='flex' alignItems='center'>
            <Typography  component="span">打卡目标：{goal_desc}</Typography>
            <IconButton aria-label="edit" size="small" onClick={() => setOpen(true)}>
                <Edit fontSize="inherit" />
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
