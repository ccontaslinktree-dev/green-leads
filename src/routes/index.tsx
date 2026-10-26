import { createFileRoute } from "@tanstack/react-router";
import { OfficeFunnel } from "@/components/office/OfficeFunnel";
export const Route = createFileRoute("/")({ component: () => <OfficeFunnel step={0} /> });
