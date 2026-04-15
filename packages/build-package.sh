#!/bin/bash
# Build AEM content package for CF models and DAM structure
# Output: 4teradyne-content-models-1.0.0.zip
# Upload via: AEM Package Manager → http://<host>:4502/crx/packmgr/index.jsp

set -e

PACKAGE_DIR="content-models"
PACKAGE_NAME="4teradyne-content-models-1.0.0"

cd "$(dirname "$0")"

echo "Building AEM content package: ${PACKAGE_NAME}.zip"

# Validate structure
echo "Validating package structure..."
required_files=(
  "${PACKAGE_DIR}/META-INF/vault/properties.xml"
  "${PACKAGE_DIR}/META-INF/vault/filter.xml"
  "${PACKAGE_DIR}/jcr_root/conf/4teradyne/settings/dam/cfm/models/defense-product/.content.xml"
  "${PACKAGE_DIR}/jcr_root/conf/4teradyne/settings/dam/cfm/models/product-category/.content.xml"
  "${PACKAGE_DIR}/jcr_root/conf/4teradyne/settings/dam/cfm/models/product-popup-detail/.content.xml"
  "${PACKAGE_DIR}/jcr_root/conf/4teradyne/settings/dam/cfm/models/filter-configuration/.content.xml"
  "${PACKAGE_DIR}/jcr_root/content/dam/4teradyne/.content.xml"
  "${PACKAGE_DIR}/jcr_root/content/dam/4teradyne/products/.content.xml"
  "${PACKAGE_DIR}/jcr_root/content/dam/4teradyne/defense-aerospace/.content.xml"
  "${PACKAGE_DIR}/jcr_root/content/dam/4teradyne/defense-aerospace/product-explorer/.content.xml"
)

for f in "${required_files[@]}"; do
  if [ ! -f "$f" ]; then
    echo "ERROR: Missing required file: $f"
    exit 1
  fi
done
echo "All required files present."

# Build zip
cd "${PACKAGE_DIR}"
zip -r "../${PACKAGE_NAME}.zip" META-INF jcr_root -x "*.DS_Store"
cd ..

echo ""
echo "Package built: packages/${PACKAGE_NAME}.zip"
echo ""
echo "To install:"
echo "  1. Open AEM Package Manager"
echo "  2. Upload ${PACKAGE_NAME}.zip"
echo "  3. Install the package"
echo ""
echo "Package contents:"
echo "  CF Models (4):"
echo "    - /conf/4teradyne/settings/dam/cfm/models/defense-product"
echo "    - /conf/4teradyne/settings/dam/cfm/models/product-category"
echo "    - /conf/4teradyne/settings/dam/cfm/models/product-popup-detail"
echo "    - /conf/4teradyne/settings/dam/cfm/models/filter-configuration"
echo "  DAM Folders:"
echo "    - /content/dam/4teradyne/products"
echo "    - /content/dam/4teradyne/defense-aerospace/product-explorer"
