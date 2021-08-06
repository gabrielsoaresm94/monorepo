import React from "react";
import styles from "../styles/Home.module.css";
import { Title } from "@monorepo/ui";

export default function Home(): any { // TODO - React.FC<>
  return (
    <div className={styles.container} id="home" style={{ color: "white" }}>
      <Title>Interface monorepo</Title>
    </div>
  );
}
function dynamic(arg0: () => Promise<any>): void {
  throw new Error("Function not implemented.");
}
