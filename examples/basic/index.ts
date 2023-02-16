import {
  text,
  select,
  confirm,
  intro,
  outro,
  cancel,
  spinner,
  isCancel,
  multiselect,
  definePromptGroup,
  definePrompt,
  note,
} from "@clack/prompts";
import color from "picocolors";
import { setTimeout } from "node:timers/promises";

async function main() {
  console.clear();

  await setTimeout(1000);

  intro(`${color.bgCyan(color.black(" create-app "))}`);

  const project = await definePromptGroup({
    onCancel: ({ cancel: cancelMessage }) => {
      cancelMessage("Group Operation cancelled.");
      process.exit(0);
    },
    prompts: [
      definePrompt('text', {
        name: "path",
        options: {
          message: "Where should we create your project?",
          placeholder: "./sparkling-solid",
        },
      }),
      {
        type: 'select',
        name: 'type',
        options: {
          message: "Pick a project type.",
          initialValue: 'ts',
          options: [
            { value: "ts", label: "TypeScript" },
            { value: "js", label: "JavaScript" },
            { value: "coffee", label: "CoffeeScript", hint: "oh no" },
          ],
        },
      },
      definePrompt('multiselect', {
        name: 'tools',
        options: {
          message: "Select additional tools.",
          cursorAt: 'stylelint',
          initialValue: ['eslint', 'gh-action'],
          options: [
            { value: "prettier", label: "Prettier", hint: "recommended" },
            { value: "eslint", label: "ESLint" },
            { value: "stylelint", label: "Stylelint" },
            { value: "gh-action", label: "GitHub Action" },
          ],
        },
      })
    ]
  })

  const install = await confirm({
    message: "Install dependencies?",
    initialValue: false
  });

  if (isCancel(install)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  if (install) {
    const s = spinner();
    s.start("Installing via pnpm");
    await setTimeout(5000);
    s.stop("Installed via pnpm");  
  }

  let nextSteps = `cd ${project.path}        \n${install ? '' : 'npm install\n'}npm run dev`;

  note(nextSteps, 'Next steps.');
  
  await setTimeout(1000);

  outro(`Problems? ${color.underline(color.cyan('https://example.com/issues'))}`);
}

main().catch(console.error);
