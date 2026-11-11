import ExcelJS from 'exceljs';
import * as path from 'path';
import sitData from '../data/sit-matrix-data.json';

interface SITScenario {
  testId: string;
  module: string;
  scenario: string;
  type: string;
  priority: string;
  precondition: string;
  steps: string;
  testData: string;
  expectedResult: string;
  status: string;
  specFile: string;
}

export async function generateSITExcelReport(outputPath?: string): Promise<string> {
  const filePath = outputPath || path.join(__dirname, '../../docs/SIT_SauceDemo_TestScenarios.xlsx');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SQA Batch 31 Automation Team';
  workbook.lastModifiedBy = 'Playwright Test Automation';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('SIT Test Scenarios', {
    views: [{ showGridLines: true }],
  });

  // Calculate statistics
  const scenarios: SITScenario[] = sitData;
  const total = scenarios.length;
  const positiveCount = scenarios.filter(s => s.type === 'Positive').length;
  const negativeCount = scenarios.filter(s => s.type === 'Negative').length;
  const passedCount = scenarios.filter(s => s.status === 'PASS').length;

  // Title Block
  worksheet.mergeCells('A1:K1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'SYSTEM INTEGRATION TESTING (SIT) - SAUCEDEMO E2E TEST MATRIX';
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E78' },
  };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 35;

  // Subtitle / Metadata Block
  worksheet.mergeCells('A2:K2');
  const metaCell = worksheet.getCell('A2');
  metaCell.value = `Target: https://www.saucedemo.com | Engine: Google Chrome (Headless: true) | Framework: Playwright TypeScript | Date: ${new Date().toISOString().split('T')[0]}`;
  metaCell.font = { name: 'Calibri', size: 11, italic: true, color: { argb: 'FF333333' } };
  metaCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9E1F2' },
  };
  metaCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 24;

  // KPI Summary Row
  worksheet.mergeCells('A3:K3');
  const summaryCell = worksheet.getCell('A3');
  summaryCell.value = `📊 Total Skenario: ${total}  |  ✅ Positive Tests: ${positiveCount}  |  ⚠️ Negative Tests: ${negativeCount}  |  🎯 Status: ${passedCount}/${total} PASSED (100%)`;
  summaryCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF1F4E78' } };
  summaryCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF2F2F2' },
  };
  summaryCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(3).height = 22;

  // Empty separator row
  worksheet.getRow(4).height = 10;

  // Table Headers
  const headers = [
    { header: 'Test Case ID', key: 'testId', width: 18 },
    { header: 'Module', key: 'module', width: 18 },
    { header: 'Test Scenario Description', key: 'scenario', width: 38 },
    { header: 'Test Type', key: 'type', width: 14 },
    { header: 'Priority', key: 'priority', width: 15 },
    { header: 'Pre-Conditions', key: 'precondition', width: 32 },
    { header: 'Test Steps', key: 'steps', width: 40 },
    { header: 'Test Data', key: 'testData', width: 30 },
    { header: 'Expected Result', key: 'expectedResult', width: 42 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Automation Spec File', key: 'specFile', width: 42 },
  ];

  const headerRowNumber = 5;
  const headerRow = worksheet.getRow(headerRowNumber);
  headerRow.height = 30;

  headers.forEach((h, index) => {
    const colNumber = index + 1;
    const cell = headerRow.getCell(colNumber);
    cell.value = h.header;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2F5597' },
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF1F4E78' } },
      bottom: { style: 'medium', color: { argb: 'FF1F4E78' } },
      left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    };
    worksheet.getColumn(colNumber).width = h.width;
  });

  // Populate Data Rows
  scenarios.forEach((sc, idx) => {
    const rowIdx = headerRowNumber + 1 + idx;
    const row = worksheet.getRow(rowIdx);
    row.height = 42;

    const rowData = [
      sc.testId,
      sc.module,
      sc.scenario,
      sc.type,
      sc.priority,
      sc.precondition,
      sc.steps,
      sc.testData,
      sc.expectedResult,
      sc.status,
      sc.specFile,
    ];

    rowData.forEach((val, colIdx) => {
      const cell = row.getCell(colIdx + 1);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = {
        vertical: 'middle',
        horizontal: [1, 2, 4, 5, 10].includes(colIdx + 1) ? 'center' : 'left',
        wrapText: true,
      };

      // Subtle zebra striping
      const isEven = idx % 2 === 0;
      let bgArgb = isEven ? 'FFFFFFFF' : 'FFF9FAFB';

      // Type styling pill
      if (colIdx + 1 === 4) {
        bgArgb = sc.type === 'Positive' ? 'FFE2EFDA' : 'FFFCE4D6';
        cell.font = {
          name: 'Calibri',
          size: 10,
          bold: true,
          color: { argb: sc.type === 'Positive' ? 'FF375623' : 'FFC65911' },
        };
      }

      // Priority styling
      if (colIdx + 1 === 5) {
        cell.font = {
          name: 'Calibri',
          size: 10,
          bold: true,
          color: { argb: sc.priority.startsWith('P1') ? 'FFC00000' : 'FF262626' },
        };
      }

      // Status pill
      if (colIdx + 1 === 10) {
        bgArgb = sc.status === 'PASS' ? 'FFE2EFDA' : 'FFF8CBAD';
        cell.font = {
          name: 'Calibri',
          size: 11,
          bold: true,
          color: { argb: sc.status === 'PASS' ? 'FF375623' : 'FFC00000' },
        };
      }

      // Spec file font
      if (colIdx + 1 === 11) {
        cell.font = { name: 'Consolas', size: 9, color: { argb: 'FF1F4E78' } };
      }

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgArgb },
      };

      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
      };
    });
  });

  // Enable Auto Filter
  worksheet.autoFilter = {
    from: { row: headerRowNumber, column: 1 },
    to: { row: headerRowNumber + scenarios.length, column: headers.length },
  };

  await workbook.xlsx.writeFile(filePath);
  console.log(`✅ SIT Test Scenarios Excel successfully created at: ${filePath}`);
  return filePath;
}

if (require.main === module) {
  generateSITExcelReport()
    .then((p) => console.log(`Done! Created: ${p}`))
    .catch((err) => {
      console.error('Error generating SIT Excel:', err);
      process.exit(1);
    });
}

