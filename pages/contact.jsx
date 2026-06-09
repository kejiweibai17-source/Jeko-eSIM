"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout.js";
import Image from "next/image";
import AccordionItem from "../components/AccordionItem";

export default function ContactPage() {
  return (
    <Layout>
      <div className=" bg-[#f0f1f2] flex-col flex justify-center items-center py-[200px] ">
        <section className="contact-form   max-w-[1920px] flex flex-col md:flex-row mx-auto w-[80%]">
          <a href="">待建置.....</a>
        </section>
      </div>
    </Layout>
  );
}
