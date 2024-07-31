import { Avatar, AvatarOwnProps, CssBaselineProps } from "@mui/material";

interface CommonAvatarProps{
    name?: string
    url?: string
    style?: React.CSSProperties
}
export const CommonAvatar = ({name, url, style}:CommonAvatarProps) => {
    const nameArray = name && name.split(' ');
    const nameInitials = nameArray ? `${nameArray[0][0]}${nameArray[1][0]}` : "";
    return (
        <>
            {(!url && name) ? 
                <Avatar style={style} title={name}>
                    {nameInitials}
                </Avatar> : ""}
            {url ?
                <Avatar style={style} title={name} alt={name} src={url} ></Avatar> : ""}
        </>
    );
}