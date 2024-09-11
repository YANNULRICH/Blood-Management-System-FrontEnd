import dayjs from "dayjs";
import StorageHelper, {StorageKeys} from "./StorageHelper";

type JWTData = {
    accessToken: string,
    tokenType: string,
    expiresAt: string,
}

export const getJwtData = (): JWTData | null => {
    let jwtData = StorageHelper.getItem(StorageKeys.JWT);
    if (!jwtData) return null;

    try {
        const _jwtData = JSON.parse(jwtData);
        if (!_jwtData) return null;

        return {
            accessToken: _jwtData.accessToken,
            tokenType: _jwtData.tokenType,
            expiresAt: _jwtData.expiresIn,
        }
    } catch (e) {
        return null;
    }
}

export const setJwtData = (accessToken: string, tokenType: string, expiresIn: number = 1000): void => {
    // const expiresAt = dayjs().add(expiresIn, 'm');
    StorageHelper.setItem(StorageKeys.JWT, JSON.stringify({
        accessToken,
        tokenType,
        expiresIn
    }));
}
