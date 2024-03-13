import Kuroshiro from "kuroshiro";
import Analyzer from "kuroshiro-analyzer-kuromoji";

export async function toRomaji(title: string): Promise<string> {
    const kuroshiro = new Kuroshiro();
    await kuroshiro.init(new Analyzer());
    return kuroshiro.convert(title, {to: "romaji"});
}

export async function hasJapanese(title: string): Promise<Boolean> {
    return Kuroshiro.Util.hasJapanese(title);
}