// tests/example.spec.ts
import { test, expect, Page, BrowserContext } from '@playwright/test';

/**
 * ✅ Fully updated & stable version
 * - Opens SwiftTranslator ONLY ONCE (single window/tab)
 * - Avoids waitForLoadState('networkidle') (SwiftTranslator never becomes "idle")
 * - Increases timeout (your suite is long)
 * - Clears input reliably
 * - Waits for output to CHANGE (prevents stale output issue)
 *
 * Run:
 *   npx playwright test --headed --workers=1
 */

// -------------------- Configuration --------------------
const CONFIG = {
  url: 'https://www.swifttranslator.com/',
  timeouts: {
    pageLoad: 1500,
    afterClear: 300,
    betweenTests: 400
  },
  selectors: {
    inputFieldName: 'Input Your Singlish Text Here.',
    outputContainer:
      'div.w-full.h-80.p-3.rounded-lg.ring-1.ring-slate-300.whitespace-pre-wrap'
  }
};

// -------------------- Types --------------------
type TestCase = {
  tcId: string;
  name: string;
  input: string;
  expected: string;
  category: string;
  grammar: string;
  length: string;
};

type UITestCase = {
  tcId: string;
  name: string;
  input: string;
  partialInput: string;
  expectedFull: string;
  category: string;
  grammar: string;
  length: string;
};

// -------------------- Test Data --------------------
const TEST_DATA: {
  positive: TestCase[];
  negative: TestCase[];
  ui: UITestCase;
} = {
  positive: [
    {
      tcId: 'Pos_Fun_0001',
      name: 'Convert a short daily greeting phrase',
      input: 'suba udhaeesanak veevaa.',
      expected: 'සුබ උදෑසනක් වේවා.',
      category: 'Greeting / request / response',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0002',
      name: 'Convert simple statement about location',
      input: 'karuNaakaralaa mata pen eka dhenna puluvandha?',
      expected: 'කරුණාකරලා මට pen එක දෙන්න පුලුවන්ද?',
      category: 'Mixed Singlish + English',
      grammar: 'Compound sentence',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0003',
      name: 'Convert simple statement about location',
      input: 'mama dhaen bus halt ekee inne.',
      expected: 'මම දැන් bus halt එකේ ඉන්නේ.',
      category: 'Names / places / common English words',
      grammar: '',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0004',
      name: 'Convert present tense daily activity',
      input: 'api dhaen lunch ganna yanavaa. oyaalath enavadha?',
      expected: 'අපි දැන් lunch ගන්න යනවා. ඔයාලත් එනවද?',
      category: 'Mixed Singlish + English',
      grammar: 'Interrogative',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0005',
      name: 'Convert complex conditional sentence',
      input: 'oya enavaanam mama balan innavaa.',
      expected: 'ඔය එනවානම් මම බලන් ඉන්නවා.',
      category: 'Daily language usage',
      grammar: 'Complex sentence',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0006',
      name: 'Convert negative sentence',
      input: 'mama ehema karannee naehae.',
      expected: 'මම එහෙම කරන්නේ නැහැ',
      category: 'Daily language usage',
      grammar: '',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0007',
      name: 'Convert negative plural sentence',
      input: 'api heta ennee naehae.',
      expected: 'අපි හෙට එන්නේ නැහැ.',
      category: 'Daily language usage',
      grammar: '',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0008',
      name: 'Convert interrogative question',
      input: 'oyaata kohomadha?',
      expected: 'ඔයාට කොහොමද?',
      category: 'Greeting / request / response',
      grammar: 'Interrogative',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0009',
      name: 'Convert interrogative complex',
      input: 'oyaa kavadhdha enna hithan inne?',
      expected: 'ඔයා කවද්ද එන්න හිතන් ඉන්නේ?',
      category: 'Daily language usage',
      grammar: 'Interrogative',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0010',
      name: 'Convert imperative command',
      input: 'vahaama enna.',
      expected: 'වහාම එන්න.',
      category: 'Daily language usage',
      grammar: 'Imperative',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0011',
      name: 'Convert imperative instruction',
      input: 'issarahata yanna.',
      expected: 'ඉස්සරහට යන්න.',
      category: 'Daily language usage',
      grammar: 'Imperative',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0012',
      name: 'Convert embedded English brand term',
      input: 'Zoom meeting ekak thiyennee.',
      expected: 'Zoom meeting එකක් තියෙන්නේ.',
      category: 'Mixed Singlish + English',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0013',
      name: 'Convert day-to-day expression',
      input: 'mata nidhimathayi.',
      expected: 'මට නිදිමතයි.',
      category: 'Daily language usage',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0014',
      name: 'Convert greeting',
      input: 'aayuboovan!',
      expected: 'ආයුබෝවන්!',
      category: 'Greeting / request / response',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0015',
      name: 'Polite request phrase',
      input: 'karuNaakaralaa eka poddak balanna.',
      expected: 'කරුණාකරලා ඒක පොඩ්ඩක් බලන්න.',
      category: 'Greeting / request / response',
      grammar: 'Imperative',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0016',
      name: 'Convert date format',
      input: '25/12/2025',
      expected: '25/12/2025',
      category: 'Punctuation / numbers',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0017',
      name: 'Convert polite request',
      input: 'karuNaakaralaa eka poddak balanna.',
      expected: 'කරුණාකරලා එක පොඩ්ඩක් බලන්න.\n\n\n\n\n\n\n\n\n',
      category: 'Greeting / request / response',
      grammar: 'Simple sentence',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0018',
      name: 'Convert response phrase',
      input: 'hari, mama karannam.',
      expected: 'හරි, මම කරන්නම්.\n\n\n\n\n\n\n\n\n\n',
      category: 'Greeting / request / response',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0019',
      name: 'Convert repeated emphasis',
      input: 'hari hari',
      expected: 'හරි හරි\n\n\n\n\n\n\n\n\n\n\n\n',
      category: 'Word combination / phrase pattern',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0020',
      name: 'Convert collocation',
      input: 'kaeema kanna',
      expected: 'කෑම කන්න\n\n\n\n\n\n\n\n\n',
      category: 'Word combination / phrase pattern',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0021',
      name: 'Convert past tense sentence',
      input: 'mama iiyee gedhara giyaa.',
      expected: 'මම ඊයේ ගෙදර ගියා.\n\n\n\n\n',
      category: 'Daily language usage',
      grammar: '',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0022',
      name: 'Convert present tense sentence',
      input: 'mama dhaen vaeda karanavaa.',
      expected: 'මම දැන් වැඩ කරනවා.\n\n',
      category: 'Daily language usage',
      grammar: '',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0023',
      name: 'Convert currency format',
      input: 'Rs. 8390',
      expected: 'Rs. 8390',
      category: 'Punctuation / numbers',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0024',
      name: 'Convert future tense sentence',
      input: 'mama heta enavaa.',
      expected: 'මම හෙට එනවා.\n\n\n',
      category: 'Daily language usage',
      grammar: '',
      length: 'S'
    }
  ],

  negative: [
    {
      tcId: 'Neg_Fun_0001',
      name: 'Joined words cause wrong segmentation',
      input: 'mamagedharayanavaa',
      expected: 'මමගෙදරයනවා',
      category: 'Typographical error handling',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Neg_Fun_0002',
      name: 'Missing spaces breaks phrase',
      input: 'matapaankannaoonee',
      expected: 'මටපාන්කන්නඕනේ',
      category: 'Typographical error handling',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Neg_Fun_0003',
      name: 'Slang phrase inaccurate conversion',
      input: 'ela machan! supiri!!',
      expected: 'එල මචන්! සුපිරි!!',
      category: 'Slang / informal language',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Neg_Fun_0004',
      name: 'Heavy slang + unusual letters',
      input: 'adoo vaedak baaragaththaanam eeka hariyata karapanko bQQ.',
      expected: 'අඩෝ වැඩක් බාරගත්තානම් ඒක හරියට කරපන්කො බං.',
      category: 'Slang / informal language',
      grammar: 'Complex sentence',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0005',
      name: 'Long paragraph causes partial conversion',
      input:
        'dhitvaa suLi kuNaatuva samaGa aethi vuu gQQvathura saha naayayaeem heethuven maarga sQQvarDhana aDhikaariya sathu maarga kotas 430k vinaashayata pathva aethi athara, ehi samastha dhiga pramaaNaya kiloomiitar 300k pamaNa vana bava pravaahana,mahaamaarga saha naagarika sQQvarDhana amaathYA bimal rathnaayaka saDHahan kaLeeya.',
      expected:
        'දිට්වා සුළි කුණාටුව සමඟ ඇති වූ ගංවතුර සහ නායයෑම් හේතුවෙන් මාර්ග සංවර්ධන අධිකාරිය සතු මාර්ග කොටස් 430ක් විනාශයට පත්ව ඇති අතර, එහි සමස්ත දිග ප්‍රමාණය කිලෝමීටර් 300ක් පමණ වන බව ප්‍රවාහන,මහාමාර්ග සහ නාගරික සංවර්ධන අමාත්‍ය බිමල් රත්නායක සඳහන් කළේය.',
      category: 'Typographical error handling',
      grammar: 'Complex sentence',
      length: 'L'
    },
    {
      tcId: 'Neg_Fun_0006',
      name: 'Line breaks not handled properly',
      input: 'mama gedhara yanavaa.\noyaa enavadha maath ekka yanna?',
      expected: 'මම ගෙදර යනවා.\nඔයා එනවද මාත් එක්ක යන්න?',
      category: 'Formatting (spaces / line breaks / paragraph)',
      grammar: 'Interrogative',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0007',
      name: 'Multiple spaces distort conversion',
      input: 'mama   gedhara    yanavaa.',
      expected: 'මම   ගෙදර    යනවා.',
      category: 'Formatting (spaces / line breaks / paragraph)',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Neg_Fun_0008',
      name: 'Mixed English terms reduce accuracy',
      input: 'Documents tika attach karalaa mata email ekak evanna.',
      expected: 'Documents ටික attach කරලා මට email එකක් එවන්න.',
      category: 'Mixed Singlish + English',
      grammar: 'Simple sentence',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0009',
      name: 'Abbreviation string not supported',
      input: 'CPU GPU RAM ROM',
      expected: 'CPU GPU RAM ROM',
      category: 'Punctuation / numbers',
      grammar: 'Simple sentence',
      length: 'S'
    },
    {
      tcId: 'Neg_Fun_0010',
      name: 'Quotation punctuation breaks output',
      input: '“oyaata kohomadha?”',
      expected: '“ඔයාට කොහොමද?”',
      category: 'Punctuation / numbers',
      grammar: 'Interrogative',
      length: 'S'
    }
  ],

  ui: {
    tcId: 'Pos_UI_0001',
    name: 'Sinhala output updates automatically in real-time',
    input: 'mama gedhara yanavaa',
    partialInput: 'mama ge',
    expectedFull: 'මම ගෙදර යනවා',
    category: 'Daily language usage',
    grammar: 'Simple sentence',
    length: 'S'
  }
};

// -------------------- Page Object --------------------
class TranslatorPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getInputField() {
    return this.page.getByRole('textbox', { name: CONFIG.selectors.inputFieldName });
  }

  getOutputField() {
    return this.page.locator(CONFIG.selectors.outputContainer).first();
  }

  async navigateToSite(): Promise<void> {
    // ✅ DO NOT wait for 'networkidle' (site keeps network busy)
    await this.page.goto(CONFIG.url, { waitUntil: 'domcontentloaded' });
    await this.getInputField().waitFor({ state: 'visible', timeout: 60000 });
    await this.page.waitForTimeout(CONFIG.timeouts.pageLoad);
  }

  async clearAndWait(): Promise<void> {
    const input = this.getInputField();
    // ✅ more reliable than input.clear()
    await input.fill('');
    await this.page.waitForTimeout(CONFIG.timeouts.afterClear);
  }

  async typeInput(text: string): Promise<void> {
    await this.getInputField().fill(text);
  }

  async getOutputText(): Promise<string> {
    const text = await this.getOutputField().textContent();
    return text?.trim() || '';
  }

  async performTranslation(inputText: string): Promise<string> {
    const before = await this.getOutputText(); // previous output

    await this.clearAndWait();
    await this.typeInput(inputText);

    // ✅ wait until output becomes non-empty AND changes from previous output
    await this.page.waitForFunction(
      ([selector, prev]) => {
        const el = document.querySelector(selector);
        const now = (el?.textContent || '').trim();
        return now.length > 0 && now !== prev;
      },
      [CONFIG.selectors.outputContainer, before],
      { timeout: 10000 }
    );

    return this.getOutputText();
  }
}

// -------------------- Test Suite --------------------
test.describe('SwiftTranslator - Singlish to Sinhala Conversion Tests', () => {
  // ✅ whole suite may take time
  test.setTimeout(120000);

  let translator: TranslatorPage;
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    translator = new TranslatorPage(page);
    await translator.navigateToSite();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test.describe('Positive Functional Tests', () => {
    for (const testCase of TEST_DATA.positive) {
      test(`${testCase.tcId} - ${testCase.name}`, async () => {
        const actualOutput = await translator.performTranslation(testCase.input);
        expect(actualOutput).toBe(testCase.expected);
        await translator.page.waitForTimeout(CONFIG.timeouts.betweenTests);
      });
    }
  });

  test.describe('Negative Functional Tests', () => {
    for (const testCase of TEST_DATA.negative) {
      test(`${testCase.tcId} - ${testCase.name}`, async () => {
        const actualOutput = await translator.performTranslation(testCase.input);
        expect(actualOutput).toBe(testCase.expected);
        await translator.page.waitForTimeout(CONFIG.timeouts.betweenTests);
      });
    }
  });

  test.describe('UI Functionality Tests', () => {
    test(`${TEST_DATA.ui.tcId} - ${TEST_DATA.ui.name}`, async () => {
      const input = translator.getInputField();
      const output = translator.getOutputField();

      await translator.clearAndWait();

      await input.pressSequentially(TEST_DATA.ui.partialInput, { delay: 150 });
      await translator.page.waitForTimeout(1200);

      const partialText = (await output.textContent())?.trim() || '';
      expect(partialText.length).toBeGreaterThan(0);

      await input.pressSequentially(
        TEST_DATA.ui.input.substring(TEST_DATA.ui.partialInput.length),
        { delay: 150 }
      );

      // Wait for final output change
      await translator.page.waitForFunction(
        ([selector, expected]) => {
          const el = document.querySelector(selector);
          const now = (el?.textContent || '').trim();
          return now.length > 0 && now === expected;
        },
        [CONFIG.selectors.outputContainer, TEST_DATA.ui.expectedFull],
        { timeout: 10000 }
      );

      const finalText = await translator.getOutputText();
      expect(finalText).toBe(TEST_DATA.ui.expectedFull);

      await translator.page.waitForTimeout(CONFIG.timeouts.betweenTests);
    });
  });
});
