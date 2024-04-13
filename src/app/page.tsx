import { Container, List, ListItemButton, ListItemText } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function Home() {
  const navList = [
    { name: '自律学习打卡', link: '/daily-attendance' }
  ]
  return (
    <Container component='main' maxWidth='sm' sx={{ my: 2, minHeight: 'calc(100vh - 32px)' }}>
        <List sx={{ bgcolor: 'background.paper'}}>
          {navList.map((item, index) => (
             <li key={index}>
                <ListItemButton component='a' href={item.link}>
                  <ListItemText primary={item.name} />
                  <NavigateNextIcon />
                </ListItemButton>
              </li>
          ))}
        </List>
    </Container>
  );
}
