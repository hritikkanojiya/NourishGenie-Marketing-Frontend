declare module "react-json-prettify" {
  interface JSONPrettyProps {
    json: Record<string, unknown>;
    theme?: string;
    mainStyle?: React.CSSProperties;
    errorStyle?: React.CSSProperties;
    valueStyle?: React.CSSProperties;
    keyStyle?: React.CSSProperties;
    stringStyle?: React.CSSProperties;
  }

  const JSONPretty: React.FC<JSONPrettyProps>;

  export default JSONPretty;
}
