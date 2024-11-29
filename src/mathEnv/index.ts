import { BlockStartInfo } from "../parseStartMarker";
import {RootContent} from "mdast";

export function parseMathEnv(
    info: &BlockStartInfo,
    buffer: &RootContent[]    
): RootContent[] {
    return buffer;
}