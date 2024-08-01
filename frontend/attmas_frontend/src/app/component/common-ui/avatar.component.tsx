import { Avatar } from "@mui/material";

interface CommonAvatarProps {
    name?: string;
    url?: string;
    style?: React.CSSProperties;
}

console.log("process.env.SERVER_URL", process.env.SERVER_URL);


// const BASE_URL = "http://localhost:3000/";
const BASE_URL = process.env.SERVER_URL;

export const CommonAvatar = ({ name, url, style }: CommonAvatarProps) => {
    const nameArray = name && name.split(' ');
    const nameInitials = nameArray ? `${nameArray[0][0]}${nameArray[1][0]}` : "";

    // Construct the full URL from the provided path
    const avatarUrl = url ? `${BASE_URL}/${url}` : "";

    return (
        <Avatar
            style={style}
            title={name}
            alt={name}
            src={avatarUrl || undefined} // Use the constructed URL if available
        >
            {!avatarUrl && name && nameInitials}
        </Avatar>
    );
}
