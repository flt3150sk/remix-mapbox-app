import { json, ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createShopDefaultValues, createShopSchema } from "domain/shop";
import { CSSProperties, useCallback } from "react";
import { postShop } from "service/postShop";
import { MapBoxClick } from "components/map-box-click";

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: createShopSchema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const shopId = await postShop(submission.value, context);
  return redirect(`/${shopId}`);
}

export default function New() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    defaultValue: createShopDefaultValues,
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createShopSchema });
    },
    shouldValidate: "onSubmit",
    shouldRevalidate: "onInput",
  });

  const { change: latChange } = useInputControl(fields.lat);
  const {change: lngChange} = useInputControl(fields.lng);

  const handleClickMap = useCallback(
    (lngInput: number, latInput: number) => {
      latChange(String(latInput));
      lngChange(String(lngInput));
    },
    [latChange, lngChange]
  );

  return (
    <div className="flex">
      <div className="flex-1 h-[calc(100vh_-_68px)]">
        <MapBoxClick handleClickMap={handleClickMap} />
      </div>
      <Form
        {...getFormProps(form)}
        method="post"
        className="w-96 border-l border-gray-200 space-y-4 p-2 h-[calc(100vh_-_68px)] overflow-scroll"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor={fields.name.id} className="font-bold text-sm">
            名前
          </label>
          <input
            {...getInputProps(fields.name, { type: "text" })}
            defaultValue={fields.name.initialValue}
            className="border border-gray-300 p-1 rounded"
          />
          <p className="text-sm text-red-600">{fields.name.errors}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={fields.description.id} className="font-bold text-sm">
            説明
          </label>
          <textarea
            {...getTextareaProps(fields.description)}
            defaultValue={fields.description.initialValue}
            className="border border-gray-300 p-1 rounded min-h-20 resize-none"
            style={{ fieldSizing: "content" } as CSSProperties}
          />
          <p className="text-sm text-red-600">{fields.description.errors}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={fields.lat.id} className="font-bold text-sm">
            緯度
          </label>
          <input
            {...getInputProps(fields.lat, { type: "number" })}
            defaultValue={fields.lat.initialValue}
            className="border border-gray-300 p-1 rounded"
            step={0.1}
          />
          <p className="text-sm text-red-600">{fields.lat.errors}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={fields.lng.id} className="font-bold text-sm">
            経度
          </label>
          <input
            {...getInputProps(fields.lng, { type: "number" })}
            defaultValue={fields.lng.initialValue}
            className="border border-gray-300 p-1 rounded"
            step={0.1}
          />
          <p className="text-sm text-red-600">{fields.lng.errors}</p>
        </div>
        <button className="p-2 bg-blue-600 rounded text-white w-full mt-4">
          新規登録
        </button>
      </Form>
    </div>
  );
}
