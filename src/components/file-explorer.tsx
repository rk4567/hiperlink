import { CopyCheck, CopyIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";
import { Hint } from "./hint";
import { Button } from "@/components/ui/button";
import { CodeView } from "./code-view";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

type FileCollection = { [path: string]: string };

function getLanguageFromExtension(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension || 'text';
};

interface FileExplorerProps {
    files: FileCollection;
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ files }) => {
    // const filePaths = useMemo(() => Object.keys(files || {}), [files]);
    const [selectedFile, setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files);
        return fileKeys.length > 0 ? fileKeys[0] : null;
    });
    // const [copied, setCopied] = useState(false);

    // const onSelect = useCallback((path: string) => {
    //     setSelected(path);
    //     setCopied(false);
    // }, []);

    // const onCopy = useCallback(async () => {
    //     if (!selected) return;
    //     try {
    //         await navigator.clipboard.writeText(files[selected]);
    //         setCopied(true);
    //         setTimeout(() => setCopied(false), 1500);
    //     } catch (e) {
    //         console.error("copy failed", e);
    //     }
    // }, [selected, files]);

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={30} defaultSize={30} className="bg-sidebar">
                <p>todo: tree view</p>
            </ResizablePanel>
            <ResizableHandle className="hover:bg-primary transition-colors" />
            <ResizablePanel minSize={50} defaultSize={70}>
                {selectedFile && files[selectedFile] ? (
                    <div>
                        <p>todo: codeview</p>
                    </div>
                ): (
                    <div className="flex h-full items-center text-muted-foreground">
                        select a file to view it&apos;s content
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};