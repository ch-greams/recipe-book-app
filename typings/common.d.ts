
declare module "*.scss" {
    const styles: { [className: string]: string };
    export default styles;
}

declare module "*.svg" {
    const content: React.StatelessComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

interface Dictionary<T> {
    [key: string]: T;
}
