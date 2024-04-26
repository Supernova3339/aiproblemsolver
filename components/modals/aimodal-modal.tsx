import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent} from '@/components/ui/dialog';
import {useModal} from '@/hooks/use-modal-store';
import {Label} from '@/components/ui/label';
import {BotIcon, RocketIcon, StarsIcon, TurtleIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {parse, serialize} from 'cookie';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Form, FormField} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

const FormSchema = z.object({
    aiModel: z
        .string({
            required_error: "Please select a model to be used by the AI.",
        })
})

const AiModelModal = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setApiModel(data['aiModel']);
        handleSave();
    }

    const {onOpen} = useModal();
    const {isOpen, onClose, type} = useModal();
    const isAiModelModalOpen = isOpen && type === "aimodel";
    const [isMounted, setIsMounted] = useState(false);
    const [apiModel, setApiModel] = useState('');
    const {toast} = useToast();

    useEffect(() => {
        setIsMounted(true);
        // Retrieve API model from cookies when component mounts
        const cookies = parse(document.cookie);
        const savedApiModel = cookies.openaiApiModel || 'gpt-3.5-turbo';
        if (savedApiModel) {
            setApiModel(savedApiModel);
        } else {
            // Something can happen here if the API model is not present (should not be possible)
        }
    }, [onOpen]);

    if (!isMounted) {
        return null;
    }

    const handleSave = () => {
        // Save API key to cookies
        document.cookie = serialize('openaiApiModel', apiModel, {path: '/'});
        toast({
            title: "Saved",
            description: "Your OpenAI API Model has been saved",
            variant: "success",
        })
        onClose();
    }

    return (
        <Dialog open={isAiModelModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <Label htmlFor="apiModel">
                    <div className="flex items-center">
                        <BotIcon style={{marginRight: 10}}/>
                        <span>Available <a className="text-green-600 dark:text-green-500 hover:underline"
                                           href="https://platform.openai.com/docs/models">OpenAI Models</a></span>
                    </div>
                </Label>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="aiModel"
                            render={({field}) => (
                                <Select
                                    name="aimodel" onValueChange={field.onChange}
                                    defaultValue={apiModel}>
                                    <SelectTrigger className="items-start [&_[data-description]]:hidden">
                                        <SelectValue placeholder="Select a model"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gpt-3.5-turbo">
                                            <div className="flex items-start gap-3 text-muted-foreground">
                                                <TurtleIcon className="size-5"/>
                                                <div className="grid gap-0.5">
                                                    <p>
                                                        GPT-3.5
                                                        <span className="font-medium text-foreground">&nbsp;Turbo</span>
                                                    </p>
                                                    <p className="text-xs" data-description>
                                                        The latest GPT-3.5 Turbo model.
                                                    </p>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="gpt-4">
                                            <div className="flex items-start gap-3 text-muted-foreground">
                                                <StarsIcon className="size-5"/>
                                                <div className="grid gap-0.5">
                                                    <p>
                                                        GPT-
                                                        <span className="font-medium text-foreground">4</span>
                                                    </p>
                                                    <p className="text-xs" data-description>
                                                        Speed and performance efficient.
                                                    </p>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="gpt-4-turbo">
                                            <div className="flex items-start gap-3 text-muted-foreground">
                                                <RocketIcon className="size-5"/>
                                                <div className="grid gap-0.5">
                                                    <p>
                                                        GPT-4
                                                        <span className="font-medium text-foreground">&nbsp;Turbo</span>
                                                    </p>
                                                    <p className="text-xs" data-description>
                                                        The latest GPT-4 Turbo model with vision capabilities.
                                                    </p>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <br/>
                        <Button className="block w-full" type="submit">
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AiModelModal;
