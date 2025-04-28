export const args = [
  [
    `
      box-shadow: var(--shadow);
    `,
  ] as any,
] as [TemplateStringsArray];

export const expected = [
  [
    `
      styled-box-shadow: `,
    `;
    `,
  ],
];
