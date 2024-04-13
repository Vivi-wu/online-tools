import { List, ListItemButton, ListItemText, Paper } from "@mui/material";
import Link from "next/link";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface ListItemLinkProps {
  primary: string;
  to: string;
}

function ListItemLink(props: ListItemLinkProps) {
  const { primary, to } = props;

  return (
    <li>
      <ListItemButton component={Link} href={to}>
        <ListItemText primary={primary} />
        <NavigateNextIcon />
      </ListItemButton>
    </li>
  );
}

export default function Home() {
  const navList = [
    { name: '自律学习打卡', link: '/daily-attendance' }
  ]
  return (
    <main>
      <Paper>
        <List>
          {navList.map((item, index) => (
            <ListItemLink key={index} to={item.link} primary={item.name}/>
          ))}
        </List>
      </Paper>
    </main>
  );
}
