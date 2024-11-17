"use client";

import PageHeader from "../components/PageHeader";
import BizList from '../displays/bizlist';

export default function Home() {
  return (
      <div>
        <PageHeader pageName="StartUp Dream" />
        <BizList />
      <br />
    </div>
  );
}
