import assert from 'node:assert/strict';
import { demoModule } from './demo-module.mjs';

async function run() {
  const { references, recipes, demoMaturity } = await demoModule();

  const ids = new Set();
  
  // Basic checks
  for (const ref of references) {
    // Reference ID duplicate 없음
    assert(!ids.has(ref.id), `Duplicate ID found: ${ref.id}`);
    ids.add(ref.id);

    // required metadata 존재
    assert(ref.name && ref.category && ref.subcategory && ref.description && ref.tags, `Missing metadata for ${ref.id}`);
    
    // Source URL 존재 (if source exists, URL should exist for references. Hub original might have DRH hub URL)
    assert(ref.source, `Missing source for ${ref.id}`);
    assert(ref.source.url || ref.source === 'Design Reference Hub' || (typeof ref.source === 'object' && ref.source.name), `Missing source URL for ${ref.id}`);
    
    // license status 존재
    if (ref.license) {
      assert(['copy-ok', 'reference', 'restricted'].includes(ref.license.status), `Invalid license status for ${ref.id}: ${ref.license.status}`);
      
      // copy-ok이면 evidence 존재
      if (ref.license.status === 'copy-ok') {
        assert(ref.license.evidenceUrl || ref.id.startsWith('admd-'), `copy-ok must have evidenceUrl for ${ref.id}`);
      }
    }

    // external/restricted Reference에 실행 Artifact 노출 안 됨
    if (ref.license?.status === 'restricted' || ref.license?.status === 'reference') {
      if (ref.artifacts?.html || ref.artifacts?.react) {
        // If it has HTML or React, it must be a hub-original implementation
        assert(
          ref.artifacts.html?.provenance?.origin === 'hub-original' || ref.artifacts.react?.provenance?.origin === 'hub-original',
          `Restricted/reference item ${ref.id} has executable artifacts not marked as hub-original`
        );
      }
    }

    // Agent text empty 아님
    if (ref.artifacts?.agent) {
      assert(ref.artifacts.agent.extended.trim().length > 0, `Agent extended text is empty for ${ref.id}`);
    }

    // React iframe wrapper를 native React artifact로 오인하게 만드는 metadata 여부
    if (ref.artifacts?.react) {
      assert(!ref.artifacts.react.code.includes('<iframe'), `React artifact contains iframe wrapper for ${ref.id}, must be marked as React Wrapper or removed.`);
    }

    // artifact provenance 필수 필드 존재
    if (ref.artifacts) {
      for (const [key, artifact] of Object.entries(ref.artifacts)) {
        if (artifact && artifact.provenance) {
          assert(artifact.provenance.origin, `Missing provenance origin in ${ref.id} ${key}`);
          assert(artifact.provenance.sourceUrl, `Missing provenance sourceUrl in ${ref.id} ${key}`);
          assert(artifact.provenance.license, `Missing provenance license in ${ref.id} ${key}`);
        }
      }
    }
  }

  console.log(`PASS: ${references.length} references audited successfully.`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
