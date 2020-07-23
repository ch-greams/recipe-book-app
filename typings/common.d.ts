
declare module "*.scss" {
    const styles: { [className: string]: string };
    export default styles;
}

interface Dictionary<T> {
    [key: string]: T;
}
